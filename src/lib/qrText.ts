import { clinicalQuestions, type ClinicalQuestionKey } from "./questions";
import { formatDate, formatDateTime, formatDuration } from "./dates";
import { triggeringQuestionLabels, type ScreeningStatus } from "./status";

export type Sex = "FEMALE" | "MALE";
export type Purpose = "BUSINESS" | "LEAVE" | "OTHER";

export type ScreeningForQrText = {
  reference: string;
  submittedAt: Date;
  status: ScreeningStatus;
  fullName: string;
  department: string;
  age: number;
  sex: Sex;
  phone: string;
  purpose: Purpose;
  purposeOther: string | null;
  fromCountry: string;
  destination: string;
  departureDate: Date;
  returnDate: Date | null;
  flight: string | null;
} & Record<ClinicalQuestionKey, boolean>;

function purposeLabel(s: Pick<ScreeningForQrText, "purpose" | "purposeOther">): string {
  if (s.purpose === "BUSINESS") return "Business";
  if (s.purpose === "LEAVE") return "Leave";
  return s.purposeOther?.trim() || "Other";
}

function yn(v: boolean): string {
  return v ? "Yes" : "No";
}

// Plain-text, ASCII-only summary encoded into the QR code — readable by any
// phone camera offline, with no app needed. Keep this layout in sync with
// the spec exactly; the pass page and PDF render the same data visually,
// but this exact text is what gets encoded.
export function buildQrText(s: ScreeningForQrText): string {
  const lines: string[] = [];
  lines.push("GPOC EVD TRAVEL SCREENING");
  lines.push(`Ref: ${s.reference}`);
  lines.push(`Submitted: ${formatDateTime(s.submittedAt)}`);

  if (s.status === "CLEAR") {
    lines.push("RESULT: CLEAR");
  } else {
    const triggered = triggeringQuestionLabels(s);
    lines.push(`RESULT: REVIEW_NEEDED (${triggered.join(", ")})`);
  }

  lines.push(`Name: ${s.fullName}`);
  lines.push(`Dept: ${s.department}`);
  lines.push(`Age/Sex: ${s.age} / ${s.sex === "FEMALE" ? "Female" : "Male"}`);
  lines.push(`Phone: ${s.phone}`);
  lines.push(`Purpose: ${purposeLabel(s)}`);
  lines.push(`From: ${s.fromCountry}  To: ${s.destination}`);

  const duration = formatDuration(s.departureDate, s.returnDate);
  const returnPart = s.returnDate ? formatDate(s.returnDate) : "—";
  const durationPart = duration ? ` (${duration})` : "";
  lines.push(`Depart: ${formatDate(s.departureDate)}  Return: ${returnPart}${durationPart}`);
  lines.push(`Flight: ${s.flight?.trim() || "—"}`);

  for (const q of clinicalQuestions) {
    lines.push(`${q.shortLabel}: ${yn(s[q.key])}`);
  }
  lines.push("Declaration: Signed");

  return lines.join("\n");
}
