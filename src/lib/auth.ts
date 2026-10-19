import "server-only";
import { cookies } from "next/headers";
import { prisma } from "./db";
import { hashToken, generateToken } from "./crypto";
import type { User } from "@prisma/client";

export { hashPassword, verifyPassword, generateToken, hashToken } from "./crypto";

export const SESSION_COOKIE = "gpoc_session";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const THIRTY_DAYS_MS = 30 * ONE_DAY_MS;

export async function createSession(
  userId: string,
  options: { rememberMe: boolean; userAgent?: string | null; ipAddress?: string | null }
): Promise<void> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + (options.rememberMe ? THIRTY_DAYS_MS : ONE_DAY_MS));

  await prisma.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt,
      userAgent: options.userAgent ?? null,
      ipAddress: options.ipAddress ?? null,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

// The one helper every protected page and action calls — never trust the
// cookie's presence alone (that's all middleware.ts checks); this looks the
// hashed token up and confirms it hasn't expired.
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session.user;
}

export async function destroyCurrentSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  cookieStore.delete(SESSION_COOKIE);
}

// Used after a password change/reset — the whole point is to sign the user
// out everywhere else a (possibly compromised) password was being used.
export async function destroyAllSessionsForUser(userId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } });
}
