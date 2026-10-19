import type { Screening } from "@prisma/client";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { formatDateTime } from "@/lib/dates";

// The focused scan-result view — deliberately NOT the full pass card.
// Someone scanning a QR at a checkpoint or clinic needs one thing fast: is
// this traveller clear, or do they need to see a doctor first. Everything
// else (destination, dates, the full clinical Q&A) is on the owner's own
// pass page, not here.
export function VerifyResult({ screening }: { screening: Screening }) {
  const isClear = screening.status === "CLEAR";

  return (
    <div className="overflow-hidden rounded-[6px] border border-[var(--color-border)] bg-white">
      <div
        className={`flex flex-col items-center gap-3 px-6 py-10 text-center sm:py-12 ${
          isClear ? "bg-[var(--color-success-bg)]" : "bg-[var(--color-danger-bg)]"
        }`}
      >
        {isClear ? (
          <CheckCircle2 size={56} className="text-[var(--color-success)]" strokeWidth={1.5} />
        ) : (
          <AlertTriangle size={56} className="text-[var(--color-danger)]" strokeWidth={1.5} />
        )}
        <p
          className={`text-2xl font-bold sm:text-3xl ${
            isClear ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"
          }`}
        >
          {isClear ? "All clear" : "See a doctor"}
        </p>
        <p className="max-w-xs text-sm text-[var(--color-navy)]">
          {isClear
            ? "No exposure reported on this traveller's screening."
            : "This traveller should see the GPOC clinic before travelling."}
        </p>
      </div>

      <div className="flex flex-col gap-3 px-6 py-6 text-center sm:py-8">
        <div>
          <p className="text-lg font-semibold text-[var(--color-navy)]">{screening.fullName}</p>
          <p className="text-sm text-[var(--color-muted)]">{screening.department}</p>
        </div>
        <div className="flex flex-col items-center gap-1 border-t border-[var(--color-border)] pt-4 text-xs text-[var(--color-muted)]">
          <p className="font-mono">{screening.reference}</p>
          <p>Submitted {formatDateTime(screening.submittedAt)}</p>
        </div>
      </div>
    </div>
  );
}
