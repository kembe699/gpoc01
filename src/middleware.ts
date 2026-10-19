import { NextResponse, type NextRequest } from "next/server";

// This only short-circuits obviously signed-out requests by checking that
// the session cookie exists, to avoid a round trip to a protected page that
// will just bounce back. It never trusts the cookie's *validity* — every
// protected page and action re-checks the session against the database via
// getCurrentUser(), since a middleware check alone can't be trusted (the
// cookie could be stale, expired, or revoked).
const PROTECTED_PREFIXES = ["/dashboard", "/screenings", "/history", "/account"];
const SESSION_COOKIE = "gpoc_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (!isProtected) return NextResponse.next();

  const hasSessionCookie = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  if (hasSessionCookie) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/screenings/:path*", "/history/:path*", "/account/:path*"],
};
