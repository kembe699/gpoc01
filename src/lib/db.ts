import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7: the client takes a driver adapter instead of reading
// DATABASE_URL from schema.prisma directly.
function buildPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set — check .env");
  }
  return new PrismaClient({ adapter: new PrismaPg(connectionString) });
}

// Cached on globalThis so Next's dev-mode module reloading doesn't open a
// fresh pool of connections on every edit.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? buildPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
