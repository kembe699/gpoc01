import type { ScreeningStatus } from "@/lib/status";

export function StatusBadge({ status }: { status: ScreeningStatus }) {
  if (status === "CLEAR") {
    return (
      <span className="inline-flex items-center rounded-[6px] bg-[var(--color-success-bg)] px-2.5 py-1 text-xs font-medium text-[var(--color-success)]">
        No exposure reported
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-[6px] bg-[var(--color-danger-bg)] px-2.5 py-1 text-xs font-medium text-[var(--color-danger)]">
      Health review needed
    </span>
  );
}
