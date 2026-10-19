import type { z } from "zod";

export type ActionResult =
  | { ok: true }
  | { ok: false; formError?: string; fieldErrors?: Record<string, string> };

// One message per field (the first issue), keyed by field name — enough
// for inline form errors without pulling in a version-specific
// flatten/treeify helper (zod's error-formatting API changed between v3
// and v4; `.issues` has not).
export function zodFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !out[key]) out[key] = issue.message;
  }
  return out;
}
