import "server-only";
import { prisma } from "./db";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

export async function recordLoginAttempt(
  email: string,
  ipAddress: string,
  success: boolean
): Promise<void> {
  await prisma.loginAttempt.create({ data: { email, ipAddress, success } });
}

// A rolling 15-minute window: 5+ failures for either the email or the IP
// in the last 15 minutes blocks further attempts, and the block lifts on
// its own as each failure ages past 15 minutes old — stored in the
// database (not memory), so it survives a server restart.
export async function isRateLimited(email: string, ipAddress: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MS);
  const [emailFailures, ipFailures] = await Promise.all([
    prisma.loginAttempt.count({
      where: { email, success: false, createdAt: { gte: since } },
    }),
    prisma.loginAttempt.count({
      where: { ipAddress, success: false, createdAt: { gte: since } },
    }),
  ]);
  return emailFailures >= MAX_FAILURES || ipFailures >= MAX_FAILURES;
}
