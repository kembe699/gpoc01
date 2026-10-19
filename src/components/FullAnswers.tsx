import type { Screening } from "@prisma/client";
import type { ClinicalQuestion } from "@/lib/questions";

// Plain <details>/<summary> — collapsible with no JavaScript needed, and
// still readable by default when printed (browsers print <details> open).
export function FullAnswers({
  screening,
  questions,
}: {
  screening: Screening;
  questions: ClinicalQuestion[];
}) {
  return (
    <details className="group rounded-[6px] border border-[var(--color-border)] p-4">
      <summary className="cursor-pointer text-sm font-medium text-[var(--color-navy)]">
        Full answers
      </summary>
      <dl className="mt-4 flex flex-col gap-2 text-sm">
        {questions.map((q) => (
          <div key={q.key} className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] py-1.5 last:border-0">
            <dt className="text-[var(--color-muted)]">{q.formLabel}</dt>
            <dd className="font-medium text-[var(--color-navy)]">
              {screening[q.key] ? "Yes" : "No"}
            </dd>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 pt-1.5">
          <dt className="text-[var(--color-muted)]">Declaration</dt>
          <dd className="font-medium text-[var(--color-navy)]">
            {screening.declarationAccepted ? "Signed" : "—"}
          </dd>
        </div>
      </dl>
    </details>
  );
}
