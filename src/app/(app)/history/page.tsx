import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getScreeningHistory, getScreeningYears } from "@/lib/data/screenings";
import { HistoryFilters } from "@/components/HistoryFilters";
import { Pagination } from "@/components/Pagination";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/dates";

export const metadata: Metadata = { title: "History | GPOC EVD Travel Screening" };

const PAGE_SIZE = 10;

function purposeLabel(purpose: string, purposeOther: string | null): string {
  if (purpose === "BUSINESS") return "Business";
  if (purpose === "LEAVE") return "Leave";
  return purposeOther || "Other";
}

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; year?: string; page?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const status = (params.status as "ALL" | "CLEAR" | "REVIEW_NEEDED" | undefined) ?? "ALL";
  const year = params.year ? Number(params.year) : undefined;

  const [result, years] = await Promise.all([
    getScreeningHistory(user.id, { search: params.search, status, year, page, pageSize: PAGE_SIZE }),
    getScreeningYears(user.id),
  ]);

  const buildHref = (targetPage: number) => {
    const p = new URLSearchParams();
    if (params.search) p.set("search", params.search);
    if (status !== "ALL") p.set("status", status);
    if (year) p.set("year", String(year));
    if (targetPage > 1) p.set("page", String(targetPage));
    const qs = p.toString();
    return qs ? `/history?${qs}` : "/history";
  };

  const isEmptyOverall = result.total === 0 && !params.search && status === "ALL" && !year;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[var(--color-navy)]">Travel history</h1>

      {isEmptyOverall ? (
        <Card className="text-center">
          <p className="text-sm text-[var(--color-muted)]">
            You haven&apos;t submitted any screenings yet.
          </p>
          <Link href="/screenings/new" className="mt-4 inline-block">
            <Button>Start screening</Button>
          </Link>
        </Card>
      ) : (
        <>
          <div className="rounded-[6px] border border-[var(--color-border)] bg-white p-4">
            <HistoryFilters years={years} />
          </div>

          {result.items.length === 0 ? (
            <Card className="text-center">
              <p className="text-sm text-[var(--color-muted)]">
                No screenings match these filters.
              </p>
            </Card>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto rounded-[6px] border border-[var(--color-border)] bg-white sm:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-muted)]">
                      <th className="px-4 py-3">Reference</th>
                      <th className="px-4 py-3">Destination</th>
                      <th className="px-4 py-3">Departure</th>
                      <th className="px-4 py-3">Return</th>
                      <th className="px-4 py-3">Purpose</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Submitted on</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {result.items.map((s) => (
                      <tr key={s.id}>
                        <td
                          className={`whitespace-nowrap border-l-4 px-4 py-3 font-mono text-xs text-[var(--color-muted)] ${
                            s.status === "CLEAR" ? "border-l-[var(--color-success)]" : "border-l-[var(--color-danger)]"
                          }`}
                        >
                          {s.reference}
                        </td>
                        <td className="px-4 py-3 text-[var(--color-navy)]">{s.destination}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-[var(--color-navy)]">
                          {formatDate(s.departureDate)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-[var(--color-navy)]">
                          {s.returnDate ? formatDate(s.returnDate) : "—"}
                        </td>
                        <td className="px-4 py-3 text-[var(--color-navy)]">
                          {purposeLabel(s.purpose, s.purposeOther)}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={s.status} />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-[var(--color-navy)]">
                          {formatDate(s.submittedAt)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <Link
                            href={`/screenings/${s.id}`}
                            className="font-medium text-[var(--color-teal)] hover:underline"
                          >
                            View pass
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="flex flex-col gap-3 sm:hidden">
                {result.items.map((s) => (
                  <Card
                    key={s.id}
                    className={`border-l-4 ${
                      s.status === "CLEAR" ? "border-l-[var(--color-success)]" : "border-l-[var(--color-danger)]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-[var(--color-navy)]">{s.destination}</p>
                        <p className="font-mono text-xs text-[var(--color-muted)]">{s.reference}</p>
                      </div>
                      <StatusBadge status={s.status} />
                    </div>
                    <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--color-muted)]">
                      <div>
                        <dt>Departure</dt>
                        <dd className="text-[var(--color-navy)]">{formatDate(s.departureDate)}</dd>
                      </div>
                      <div>
                        <dt>Purpose</dt>
                        <dd className="text-[var(--color-navy)]">
                          {purposeLabel(s.purpose, s.purposeOther)}
                        </dd>
                      </div>
                    </dl>
                    <Link
                      href={`/screenings/${s.id}`}
                      className="mt-3 inline-block text-sm font-medium text-[var(--color-teal)] hover:underline"
                    >
                      View pass
                    </Link>
                  </Card>
                ))}
              </div>

              <Pagination page={result.page} totalPages={result.totalPages} buildHref={buildHref} />
            </>
          )}
        </>
      )}
    </div>
  );
}
