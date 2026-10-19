import "server-only";
import { prisma } from "../db";
import type { Prisma, Screening } from "@prisma/client";

// Every query here is scoped by userId — a user must never be able to see
// another user's screenings, even by guessing or enumerating IDs.

export async function getScreeningForOwner(id: string, userId: string): Promise<Screening | null> {
  return prisma.screening.findFirst({ where: { id, userId } });
}

export async function getLatestScreening(userId: string): Promise<Screening | null> {
  return prisma.screening.findFirst({
    where: { userId },
    orderBy: { submittedAt: "desc" },
  });
}

export async function getRecentScreenings(userId: string, limit: number): Promise<Screening[]> {
  return prisma.screening.findMany({
    where: { userId },
    orderBy: { submittedAt: "desc" },
    take: limit,
  });
}

export type ScreeningHistoryFilter = {
  search?: string;
  status?: "ALL" | "CLEAR" | "REVIEW_NEEDED";
  year?: number;
  page: number;
  pageSize: number;
};

export type ScreeningHistoryResult = {
  items: Screening[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export async function getScreeningHistory(
  userId: string,
  filter: ScreeningHistoryFilter
): Promise<ScreeningHistoryResult> {
  const where: Prisma.ScreeningWhereInput = { userId };

  if (filter.search?.trim()) {
    const term = filter.search.trim();
    where.OR = [
      { destination: { contains: term, mode: "insensitive" } },
      { reference: { contains: term, mode: "insensitive" } },
    ];
  }

  if (filter.status && filter.status !== "ALL") {
    where.status = filter.status;
  }

  if (filter.year) {
    where.submittedAt = {
      gte: new Date(Date.UTC(filter.year, 0, 1)),
      lt: new Date(Date.UTC(filter.year + 1, 0, 1)),
    };
  }

  const [items, total] = await Promise.all([
    prisma.screening.findMany({
      where,
      orderBy: { submittedAt: "desc" },
      skip: (filter.page - 1) * filter.pageSize,
      take: filter.pageSize,
    }),
    prisma.screening.count({ where }),
  ]);

  return {
    items,
    total,
    page: filter.page,
    pageSize: filter.pageSize,
    totalPages: Math.max(1, Math.ceil(total / filter.pageSize)),
  };
}

// Distinct submission years for this user, for the history page's year
// filter dropdown.
export async function getScreeningYears(userId: string): Promise<number[]> {
  const rows = await prisma.$queryRaw<{ year: number }[]>`
    SELECT DISTINCT EXTRACT(YEAR FROM "submittedAt")::int as year
    FROM "Screening"
    WHERE "userId" = ${userId}
    ORDER BY year DESC
  `;
  return rows.map((r) => r.year);
}
