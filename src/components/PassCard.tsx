import type { Screening } from "@prisma/client";
import { StatusBadge } from "./ui/StatusBadge";
import { Logo } from "./Logo";
import { FullAnswers } from "./FullAnswers";
import { clinicalQuestions } from "@/lib/questions";
import { formatDate, formatDateTime, formatDuration } from "@/lib/dates";

function purposeLabel(purpose: string, purposeOther: string | null): string {
  if (purpose === "BUSINESS") return "Business";
  if (purpose === "LEAVE") return "Leave";
  return purposeOther || "Other";
}

// The visual pass card itself — shared between the owner's view
// (/screenings/[id], behind login) and the public scan-to-verify view
// (/verify/[id], no login needed). Both show the same information; only
// the actions around this card (download/print for the owner, just print
// for a scanner) differ.
export function PassCard({ screening, qrDataUrl }: { screening: Screening; qrDataUrl: string }) {
  return (
    <div id="pass-card" className="rounded-[6px] border border-[var(--color-border)] bg-white p-8">
      <div className="flex items-center justify-between">
        <Logo />
        <StatusBadge status={screening.status} />
      </div>

      <h1 className="mt-6 text-xl font-semibold text-[var(--color-navy)]">
        EVD Travel Screening Pass
      </h1>
      <p className="mt-1 font-mono text-sm text-[var(--color-muted)]">{screening.reference}</p>

      <dl className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-[var(--color-muted)]">Staff name</dt>
          <dd className="font-medium text-[var(--color-navy)]">{screening.fullName}</dd>
        </div>
        <div>
          <dt className="text-[var(--color-muted)]">Department</dt>
          <dd className="font-medium text-[var(--color-navy)]">{screening.department}</dd>
        </div>
        <div>
          <dt className="text-[var(--color-muted)]">Destination</dt>
          <dd className="font-medium text-[var(--color-navy)]">{screening.destination}</dd>
        </div>
        <div>
          <dt className="text-[var(--color-muted)]">Purpose</dt>
          <dd className="font-medium text-[var(--color-navy)]">
            {purposeLabel(screening.purpose, screening.purposeOther)}
          </dd>
        </div>
        <div>
          <dt className="text-[var(--color-muted)]">Departure date</dt>
          <dd className="font-medium text-[var(--color-navy)]">
            {formatDate(screening.departureDate)}
          </dd>
        </div>
        <div>
          <dt className="text-[var(--color-muted)]">Return date</dt>
          <dd className="font-medium text-[var(--color-navy)]">
            {screening.returnDate ? formatDate(screening.returnDate) : "—"}
            {formatDuration(screening.departureDate, screening.returnDate) && (
              <span className="text-[var(--color-muted)]">
                {" "}
                ({formatDuration(screening.departureDate, screening.returnDate)})
              </span>
            )}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-[var(--color-muted)]">Submitted</dt>
          <dd className="font-medium text-[var(--color-navy)]">
            {formatDateTime(screening.submittedAt)}
          </dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-col items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrDataUrl}
          alt={`QR code for screening ${screening.reference}`}
          width={240}
          height={240}
          className="h-[240px] w-[240px]"
        />
        <p className="text-xs text-[var(--color-muted)]">
          Scan with any phone camera to open this verification page.
        </p>
      </div>

      <div className="mt-8">
        <FullAnswers screening={screening} questions={clinicalQuestions} />
      </div>
    </div>
  );
}
