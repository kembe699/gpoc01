import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import type { PoolConfig } from "pg";

// Prisma 7: the client takes a driver adapter instead of reading
// DATABASE_URL from schema.prisma directly.
//
// On Vercel every function instance opens its own pool, so DATABASE_URL must
// point at Supabase's connection pooler (transaction mode, port 6543) and
// each instance keeps only a few connections (DB_POOL_MAX, default 3 on
// Vercel). node-postgres sends unnamed statements, which is what the
// transaction-mode pooler needs.
function poolConfig(): PoolConfig {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL is not set — check .env (or the Vercel project's environment variables)");
  }

  const url = new URL(raw);
  const local = ["localhost", "127.0.0.1"].includes(url.hostname);
  // pg treats sslmode=require in the URL as full certificate verification,
  // and Supabase's certificate chain isn't in Node's default trust store, so
  // the connection would fail with "self-signed certificate in certificate
  // chain". TLS is configured explicitly below instead: verified against the
  // Supabase CA when DATABASE_CA_CERT is set (recommended), otherwise
  // encrypted without verifying the chain.
  url.searchParams.delete("sslmode");
  const ca = process.env.DATABASE_CA_CERT?.replace(/\\n/g, "\n");
  const ssl: PoolConfig["ssl"] = local ? undefined : ca ? { ca, rejectUnauthorized: true } : { rejectUnauthorized: false };

  const onVercel = Boolean(process.env.VERCEL);
  return {
    connectionString: url.toString(),
    ssl,
    max: Number(process.env.DB_POOL_MAX) || (onVercel ? 3 : 10),
    // Release idle connections quickly: a frozen serverless instance should
    // not hold pooler slots it isn't using.
    idleTimeoutMillis: onVercel ? 10_000 : 30_000,
    connectionTimeoutMillis: 10_000,
  };
}

function buildPrismaClient() {
  return new PrismaClient({ adapter: new PrismaPg(poolConfig()) });
}

// Cached on globalThis so Next's dev-mode module reloading doesn't open a
// fresh pool of connections on every edit — and so a warm serverless
// instance reuses one pool across requests.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function client(): PrismaClient {
  if (!globalForPrisma.prisma) globalForPrisma.prisma = buildPrismaClient();
  return globalForPrisma.prisma;
}

// Built on first use, not when this module loads. `next build` imports every
// route while collecting page data, and must not need a database (or
// DATABASE_URL) to do that — a missing URL now surfaces at request time,
// with the message above, instead of failing the whole build.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const real = client();
    const value = Reflect.get(real, prop, real);
    return typeof value === "function" ? value.bind(real) : value;
  },
});
