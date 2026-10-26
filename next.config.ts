import type { NextConfig } from "next";
import { existsSync } from "fs";
import { join } from "path";

// On Vercel `public/` is served from the CDN and is not in the function's
// filesystem, so whether the real logo exists is decided here, at build time.
const hasRealLogo = existsSync(join(process.cwd(), "public", "logo.svg"));
// Vercel's preview deployments inject the Vercel toolbar (comments, share)
// from vercel.live; production keeps the strict policy below.
const isVercelPreview = process.env.VERCEL_ENV === "preview";

// `cacheComponents`/`partialPrefetching` (Next 16 experimental caching) are
// deliberately left off — every signed-in page here renders per-session
// content from a cookie, and an experimental cache layer is the wrong place
// to find that out the hard way.
const nextConfig: NextConfig = {
  // Needed for the multi-stage Dockerfile — bundles a minimal
  // node_modules subset into .next/standalone rather than shipping the
  // whole dependency tree. Vercel builds its own output, so it is skipped there.
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  env: {
    NEXT_PUBLIC_HAS_LOGO: hasRealLogo ? "1" : "",
  },
  // Wires Tailwind v4 into Turbopack's CSS pipeline — without this,
  // `@import "tailwindcss"` in globals.css never actually compiles to
  // utility classes (the page renders completely unstyled, with no error).
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    // Dev mode only: Turbopack's dev-mode CSS injection (and some of
    // React's dev-mode debugging helpers) use eval(), which a strict CSP
    // blocks outright — with no visible error beyond the browser console,
    // the whole page just renders unstyled. Production builds compile to
    // real static CSS and don't need this, so the stricter policy still
    // applies there.
    const isDev = process.env.NODE_ENV !== "production";
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${isVercelPreview ? " https://vercel.live" : ""}`,
      `style-src 'self' 'unsafe-inline'${isVercelPreview ? " https://vercel.live" : ""}`,
      `img-src 'self' data:${isVercelPreview ? " https://vercel.live https://vercel.com" : ""}`,
      `font-src 'self' data:${isVercelPreview ? " https://vercel.live https://assets.vercel.com" : ""}`,
      `connect-src 'self'${isVercelPreview ? " https://vercel.live wss://ws-us3.pusher.com" : ""}`,
      ...(isVercelPreview ? ["frame-src https://vercel.live"] : []),
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
