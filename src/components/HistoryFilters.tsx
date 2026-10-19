"use client";

import { useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";

export function HistoryFilters({ years }: { years: number[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);

  const currentSearch = searchParams.get("search") ?? "";
  const currentStatus = searchParams.get("status") ?? "ALL";
  const currentYear = searchParams.get("year") ?? "";

  function submit() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const params = new URLSearchParams();
    const search = String(formData.get("search") || "").trim();
    const status = String(formData.get("status") || "ALL");
    const year = String(formData.get("year") || "");
    if (search) params.set("search", search);
    if (status !== "ALL") params.set("status", status);
    if (year) params.set("year", year);
    // Changing a filter always goes back to page 1.
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label htmlFor="search" className="text-sm font-medium text-[var(--color-navy)]">
          Search
        </label>
        <div className="mt-1.5 flex">
          <input
            id="search"
            name="search"
            type="search"
            defaultValue={currentSearch}
            placeholder="Destination or reference"
            className="w-full rounded-l-[6px] border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm text-[var(--color-navy)] focus:border-[var(--color-teal)]"
          />
          <button
            type="submit"
            aria-label="Search"
            className="rounded-r-[6px] border border-l-0 border-[var(--color-border)] bg-white px-3 text-[var(--color-muted)] hover:text-[var(--color-teal)]"
          >
            <Search size={16} />
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="status" className="text-sm font-medium text-[var(--color-navy)]">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={currentStatus}
          onChange={submit}
          className="mt-1.5 rounded-[6px] border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm text-[var(--color-navy)] focus:border-[var(--color-teal)]"
        >
          <option value="ALL">All</option>
          <option value="CLEAR">Clear</option>
          <option value="REVIEW_NEEDED">Review needed</option>
        </select>
      </div>

      <div>
        <label htmlFor="year" className="text-sm font-medium text-[var(--color-navy)]">
          Year
        </label>
        <select
          id="year"
          name="year"
          defaultValue={currentYear}
          onChange={submit}
          className="mt-1.5 rounded-[6px] border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm text-[var(--color-navy)] focus:border-[var(--color-teal)]"
        >
          <option value="">All years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}
