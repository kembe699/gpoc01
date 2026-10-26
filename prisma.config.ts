import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 moved the datasource connection string (and the seed command)
// out of schema.prisma and into this file. The CLI (migrate, studio,
// db seed) reads from here; the app's own runtime client in
// src/lib/db.ts gets DATABASE_URL via a driver adapter instead.
//
// Migrations need a direct (or session-mode) connection: Supabase's
// transaction-mode pooler, which the app uses at runtime, can't hold the
// advisory lock `prisma migrate` takes. So the CLI uses DIRECT_URL when it is
// set and falls back to DATABASE_URL (local Postgres needs only that one).
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || "",
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
