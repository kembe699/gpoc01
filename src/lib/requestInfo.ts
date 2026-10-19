import "server-only";
import { headers } from "next/headers";

// Server Actions don't get a raw Request object, so IP/user-agent come
// from the forwarded headers instead. Behind most reverse proxies (Nginx,
// per the README) x-forwarded-for carries the real client IP.
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return h.get("x-real-ip") || "unknown";
}

export async function getUserAgent(): Promise<string> {
  const h = await headers();
  return h.get("user-agent") || "unknown";
}
