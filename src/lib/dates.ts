// All display dates use Africa/Kampala (UTC+3, no DST) regardless of the
// server's own timezone, per spec: dates render as "22 Oct 2026".

const KAMPALA_TZ = "Africa/Kampala";

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: KAMPALA_TZ,
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: KAMPALA_TZ,
  }).format(d);
  return `${formatDate(d)} ${time}`;
}

export function daysBetween(start: Date | string, end: Date | string): number {
  const s = typeof start === "string" ? new Date(start) : start;
  const e = typeof end === "string" ? new Date(end) : end;
  const ms = e.getTime() - s.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

// "22 Oct depart, 29 Oct return" is shown as "(7 days)" — a plain
// difference, not an inclusive day count.
export function formatDuration(
  start: Date | string,
  end: Date | string | null | undefined
): string | null {
  if (!end) return null;
  const days = daysBetween(start, end);
  if (days < 0) return null;
  return `${days} day${days === 1 ? "" : "s"}`;
}
