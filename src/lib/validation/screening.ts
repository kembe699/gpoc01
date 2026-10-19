import { z } from "zod";
import { clinicalQuestions, type ClinicalQuestionKey } from "../questions";

export const sexEnum = z.enum(["FEMALE", "MALE"]);
export const purposeEnum = z.enum(["BUSINESS", "LEAVE", "OTHER"]);

// "Today" in Africa/Kampala, as a YYYY-MM-DD string — every date field in
// this form is a plain date (no time), so comparing as ISO date strings is
// both simpler and more correct than constructing Date objects and risking
// a timezone-shifted day boundary.
export function kampalaTodayStr(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Kampala",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

const clinicalShape = Object.fromEntries(
  clinicalQuestions.map((q) => [q.key, z.boolean()])
) as Record<ClinicalQuestionKey, z.ZodBoolean>;

const baseScreeningSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the full name"),
  department: z.string().trim().min(1, "Department is required"),
  age: z.coerce
    .number()
    .int("Age must be a whole number")
    .min(16, "Age must be between 16 and 90")
    .max(90, "Age must be between 16 and 90"),
  sex: sexEnum,
  phone: z.string().trim().min(6, "Enter a valid phone number"),
  email: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Enter a valid email address"),

  purpose: purposeEnum,
  purposeOther: z.string().trim().optional(),
  fromCountry: z.string().trim().min(1, "Required"),
  destination: z.string().trim().min(1, "Destination is required"),
  departureDate: z.string().min(1, "Departure date is required"),
  returnDate: z.string().optional(),
  flight: z.string().trim().optional(),

  ...clinicalShape,

  declarationAccepted: z.boolean(),
});

export const screeningSchema = baseScreeningSchema.superRefine((data, ctx) => {
  if (data.purpose === "OTHER" && !data.purposeOther?.trim()) {
    ctx.addIssue({
      code: "custom",
      message: "Please describe the purpose of travel",
      path: ["purposeOther"],
    });
  }

  if (data.departureDate < kampalaTodayStr()) {
    ctx.addIssue({
      code: "custom",
      message: "Departure date cannot be in the past",
      path: ["departureDate"],
    });
  }

  if (data.returnDate && data.returnDate < data.departureDate) {
    ctx.addIssue({
      code: "custom",
      message: "Return date must be on or after the departure date",
      path: ["returnDate"],
    });
  }

  if (!data.declarationAccepted) {
    ctx.addIssue({
      code: "custom",
      message: "You must confirm the declaration to submit",
      path: ["declarationAccepted"],
    });
  }
});

export type ScreeningFormInput = z.input<typeof screeningSchema>;
export type ScreeningFormOutput = z.output<typeof screeningSchema>;
