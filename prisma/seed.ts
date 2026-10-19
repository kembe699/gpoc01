// Standalone script run via `tsx` (not through Next's bundler), so this
// deliberately does NOT import src/lib/auth.ts — that file is guarded by
// the "server-only" package, which throws when loaded outside Next's own
// server runtime. bcrypt is used directly here instead.
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const prisma = new PrismaClient({ adapter: new PrismaPg(connectionString) });

const baseAnswers = {
  contactFever: false,
  contactGI: false,
  contactAches: false,
  contactWeakness: false,
  contactBleeding: false,
  ownSymptoms21d: false,
  bodyFluidContact: false,
  burialContact: false,
  awarenessReceived: true,
  followingPrecautions: true,
};

async function main() {
  const email = "demo@gpoc.test";
  const passwordHash = await bcrypt.hash("Demo1234", 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      fullName: "Demo User",
      email,
      passwordHash,
      department: "Health & Safety",
      phone: "+256700000000",
    },
  });

  // Idempotent — re-running the seed replaces this user's screenings
  // rather than piling up duplicates.
  await prisma.screening.deleteMany({ where: { userId: user.id } });

  await prisma.screening.create({
    data: {
      reference: "EVD-20261001-AAA1",
      userId: user.id,
      status: "CLEAR",
      fullName: user.fullName,
      department: user.department,
      age: 34,
      sex: "FEMALE",
      phone: user.phone,
      email: user.email,
      purpose: "BUSINESS",
      fromCountry: "Uganda",
      destination: "Kenya, Nairobi",
      departureDate: new Date("2026-10-05"),
      returnDate: new Date("2026-10-12"),
      flight: "KQ412",
      ...baseAnswers,
      declarationAccepted: true,
      submittedAt: new Date("2026-10-01T09:00:00Z"),
    },
  });

  await prisma.screening.create({
    data: {
      reference: "EVD-20260915-BBB2",
      userId: user.id,
      status: "CLEAR",
      fullName: user.fullName,
      department: user.department,
      age: 34,
      sex: "FEMALE",
      phone: user.phone,
      email: user.email,
      purpose: "LEAVE",
      fromCountry: "Uganda",
      destination: "United Arab Emirates, Dubai",
      departureDate: new Date("2026-09-20"),
      returnDate: new Date("2026-09-27"),
      flight: "EK721",
      ...baseAnswers,
      declarationAccepted: true,
      submittedAt: new Date("2026-09-15T14:30:00Z"),
    },
  });

  await prisma.screening.create({
    data: {
      reference: "EVD-20260801-CCC3",
      userId: user.id,
      status: "REVIEW_NEEDED",
      fullName: user.fullName,
      department: user.department,
      age: 34,
      sex: "FEMALE",
      phone: user.phone,
      email: user.email,
      purpose: "OTHER",
      purposeOther: "Conference",
      fromCountry: "Uganda",
      destination: "Democratic Republic of Congo, Goma",
      departureDate: new Date("2026-08-05"),
      returnDate: new Date("2026-08-10"),
      flight: null,
      ...baseAnswers,
      contactFever: true,
      declarationAccepted: true,
      submittedAt: new Date("2026-08-01T08:00:00Z"),
    },
  });

  console.log("Seed complete — sign in with demo@gpoc.test / Demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
