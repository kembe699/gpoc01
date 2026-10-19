// Pure password/token helpers, deliberately with no "server-only" guard and
// no Next.js imports — so they can be unit-tested directly with Vitest in
// plain Node, unlike lib/auth.ts (which touches cookies()/prisma and must
// only ever run inside Next's own server runtime).
import { randomBytes, createHash } from "crypto";
import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Sessions and password-reset links both work the same way: a random
// 32-byte token goes to the browser/email link, and only its SHA-256 hash
// is ever stored — so a leaked database never hands over usable tokens.
export function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
