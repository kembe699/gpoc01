// Vercel build: generate the Prisma client, apply migrations on PRODUCTION
// deploys only, then build Next.js.
//
// Preview deployments (every branch / pull request) must never migrate the
// production database, so migrations run only when VERCEL_ENV=production —
// and can be switched off with RUN_MIGRATIONS=false to run them by hand.
// `prisma migrate deploy` only applies migrations already committed under
// prisma/migrations; it never generates or drops anything.
import { execSync } from "node:child_process";

const run = (cmd) => {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: "inherit", env: process.env });
};

run("npx prisma generate");

const isProduction = process.env.VERCEL_ENV === "production";
if (isProduction && process.env.RUN_MIGRATIONS !== "false") {
  if (!process.env.DIRECT_URL && !process.env.DATABASE_URL) {
    throw new Error("Set DIRECT_URL (Supabase direct or session connection) to run migrations during the production build.");
  }
  run("npx prisma migrate deploy");
} else {
  console.log(`\n(skipping migrations: VERCEL_ENV=${process.env.VERCEL_ENV || "unset"}${process.env.RUN_MIGRATIONS === "false" ? ", RUN_MIGRATIONS=false" : ""})`);
}

run("npx next build");
