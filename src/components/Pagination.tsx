import Link from "next/link";

export function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-4 flex items-center justify-between" aria-label="Pagination">
      <Link
        href={buildHref(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={`rounded-[6px] border border-[var(--color-border)] px-3 py-1.5 text-sm ${
          page <= 1
            ? "pointer-events-none text-[var(--color-muted)] opacity-50"
            : "text-[var(--color-navy)] hover:border-[var(--color-teal)]"
        }`}
      >
        Previous
      </Link>
      <span className="text-sm text-[var(--color-muted)]">
        Page {page} of {totalPages}
      </span>
      <Link
        href={buildHref(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={`rounded-[6px] border border-[var(--color-border)] px-3 py-1.5 text-sm ${
          page >= totalPages
            ? "pointer-events-none text-[var(--color-muted)] opacity-50"
            : "text-[var(--color-navy)] hover:border-[var(--color-teal)]"
        }`}
      >
        Next
      </Link>
    </nav>
  );
}
