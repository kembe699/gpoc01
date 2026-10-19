import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getLatestScreening, getRecentScreenings } from "@/lib/data/screenings";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/dates";

export const metadata: Metadata = { title: "Dashboard | GPOC EVD Travel Screening" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [latest, recent] = await Promise.all([
    getLatestScreening(user.id),
    getRecentScreenings(user.id, 5),
  ]);

  const firstName = user.fullName.split(" ")[0] || user.fullName;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col items-start justify-between gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-teal)]">Dashboard</p>
          <h1 className="mt-1.5 text-2xl font-bold text-[var(--color-navy)]">Hello, {firstName}</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Here&apos;s an overview of your EVD travel screenings.
          </p>
        </div>
        <Link href="/screenings/new">
          <Button>
            <Plus size={16} aria-hidden="true" />
            New travel screening
          </Button>
        </Link>
      </div>

      <section>
        <h2 className="text-sm font-semibold text-[var(--color-navy)]">Latest submission</h2>
        <div className="mt-3">
          {latest ? (
            <div
              className={`flex flex-col gap-4 rounded-[6px] border border-l-4 bg-white p-6 sm:flex-row sm:items-center sm:justify-between ${
                latest.status === "CLEAR"
                  ? "border-[var(--color-border)] border-l-[var(--color-success)]"
                  : "border-[var(--color-border)] border-l-[var(--color-danger)]"
              }`}
            >
              <div>
                <p className="font-medium text-[var(--color-navy)]">{latest.destination}</p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  Departing {formatDate(latest.departureDate)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={latest.status} />
                <Link
                  href={`/screenings/${latest.id}`}
                  className="text-sm font-medium text-[var(--color-teal)] hover:underline"
                >
                  View pass
                </Link>
              </div>
            </div>
          ) : (
            <Card className="text-center">
              <p className="text-sm text-[var(--color-muted)]">
                You haven&apos;t submitted any screenings yet.
              </p>
              <Link href="/screenings/new" className="mt-4 inline-block">
                <Button>Start screening</Button>
              </Link>
            </Card>
          )}
        </div>
      </section>

      {recent.length > 0 && (
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--color-navy)]">Recent submissions</h2>
            <Link href="/history" className="text-sm font-medium text-[var(--color-teal)] hover:underline">
              View all history
            </Link>
          </div>
          <div className="mt-3 overflow-hidden rounded-[6px] border border-[var(--color-border)] bg-white">
            <ul className="divide-y divide-[var(--color-border)]">
              {recent.map((s) => (
                <li
                  key={s.id}
                  className={`flex items-center justify-between gap-4 border-l-4 px-4 py-3 ${
                    s.status === "CLEAR" ? "border-l-[var(--color-success)]" : "border-l-[var(--color-danger)]"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--color-navy)]">{s.destination}</p>
                    <p className="text-xs text-[var(--color-muted)]">{formatDate(s.departureDate)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={s.status} />
                    <Link
                      href={`/screenings/${s.id}`}
                      className="text-sm font-medium text-[var(--color-teal)] hover:underline"
                    >
                      View pass
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
