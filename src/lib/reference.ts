// Reference numbers look like EVD-20261019-4F2A. The uniqueness check is
// injected rather than imported directly, so this stays testable without a
// real database.

const SUFFIX_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomSuffix(length = 4): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += SUFFIX_CHARS[Math.floor(Math.random() * SUFFIX_CHARS.length)];
  }
  return out;
}

export function buildReferenceCandidate(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `EVD-${y}${m}${d}-${randomSuffix()}`;
}

export const REFERENCE_PATTERN = /^EVD-\d{8}-[A-Z0-9]{4}$/;

export async function generateUniqueReference(
  exists: (reference: string) => Promise<boolean>,
  maxAttempts = 10
): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const candidate = buildReferenceCandidate();
    if (!(await exists(candidate))) return candidate;
  }
  throw new Error("Could not generate a unique screening reference number — please try again.");
}
