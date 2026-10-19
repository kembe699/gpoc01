"use server";

import { redirect } from "next/navigation";
import { prisma } from "../db";
import {
  hashPassword,
  verifyPassword,
  createSession,
  destroyCurrentSession,
  destroyAllSessionsForUser,
  getCurrentUser,
  generateToken,
  hashToken,
} from "../auth";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "../validation/auth";
import { getClientIp, getUserAgent } from "../requestInfo";
import { recordLoginAttempt, isRateLimited } from "../rateLimit";
import { sendEmail } from "../email";
import { config } from "../config";
import { type ActionResult, zodFieldErrors } from "./shared";

// A safe redirect target after login — must be a same-site relative path,
// never a full URL (which could send a signed-in user off-site).
function safeNextPath(next: string | undefined | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/dashboard";
  return next;
}

export async function registerAction(input: unknown): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, fieldErrors: zodFieldErrors(parsed.error) };
  const { fullName, email, department, phone, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, fieldErrors: { email: "This email is already registered" } };
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { fullName, email, department, phone, passwordHash },
  });

  const [ip, userAgent] = await Promise.all([getClientIp(), getUserAgent()]);
  await createSession(user.id, { rememberMe: false, userAgent, ipAddress: ip });

  redirect("/dashboard");
}

export async function loginAction(input: unknown, next?: string): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { ok: false, fieldErrors: zodFieldErrors(parsed.error) };
  const { email, password, rememberMe } = parsed.data;

  const ip = await getClientIp();
  if (await isRateLimited(email, ip)) {
    return {
      ok: false,
      formError: "Too many failed attempts. Please try again in 15 minutes.",
    };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const valid = user ? await verifyPassword(password, user.passwordHash) : false;

  // Recorded against the submitted email even if no such account exists —
  // the rate limit has to work the same way for a guessed email as a real
  // one, or it would leak which emails are registered.
  await recordLoginAttempt(email, ip, valid);

  if (!user || !valid) {
    return { ok: false, formError: "Incorrect email or password" };
  }

  const userAgent = await getUserAgent();
  await createSession(user.id, { rememberMe, userAgent, ipAddress: ip });
  redirect(safeNextPath(next));
}

export async function logoutAction(): Promise<void> {
  await destroyCurrentSession();
  redirect("/login");
}

export async function forgotPasswordAction(input: unknown): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, fieldErrors: zodFieldErrors(parsed.error) };
  const { email } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash: hashToken(token), expiresAt },
    });
    const link = `${config.appUrl}/reset-password/${token}`;
    await sendEmail({
      to: user.email,
      subject: "Reset your GPOC password",
      text: `We received a request to reset your GPOC Health & Safety password.\n\nUse this link within 1 hour to choose a new one:\n${link}\n\nIf you didn't request this, you can safely ignore this email.`,
    });
  }

  // Identical response whether or not the account exists — never reveal
  // which emails are registered.
  return { ok: true };
}

export async function resetPasswordAction(input: unknown): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, fieldErrors: zodFieldErrors(parsed.error) };
  const { token, password } = parsed.data;

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return {
      ok: false,
      formError: "This reset link is invalid or has expired. Please request a new one.",
    };
  }

  const passwordHash = await hashPassword(password);
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    prisma.session.deleteMany({ where: { userId: record.userId } }),
  ]);

  redirect("/login?reset=success");
}

export async function changePasswordAction(input: unknown): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, fieldErrors: zodFieldErrors(parsed.error) };
  const { currentPassword, newPassword } = parsed.data;

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) {
    return { ok: false, fieldErrors: { currentPassword: "Current password is incorrect" } };
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  // Signs out every other session, then immediately issues a fresh one for
  // this browser — otherwise this request would log itself out too.
  await destroyAllSessionsForUser(user.id);
  const [ip, userAgent] = await Promise.all([getClientIp(), getUserAgent()]);
  await createSession(user.id, { rememberMe: true, userAgent, ipAddress: ip });

  return { ok: true };
}
