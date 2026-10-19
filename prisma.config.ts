import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7 moved the datasource connection string (and the seed command)
// out of schema.prisma and into this file. The CLI (migrate, studio,
// db seed) reads from here; the app's own runtime client in
// src/lib/db.ts gets the same URL via a driver adapter instead.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
