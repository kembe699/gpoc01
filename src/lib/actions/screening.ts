"use server";

import { redirect } from "next/navigation";
import { prisma } from "../db";
import { getCurrentUser } from "../auth";
import { screeningSchema } from "../validation/screening";
import { calculateStatus, type ClinicalAnswers } from "../status";
import { generateUniqueReference } from "../reference";
import { clinicalQuestions, type ClinicalQuestionKey } from "../questions";
import { type ActionResult, zodFieldErrors } from "./shared";

// Submissions are never edited once made — they're a health declaration.
// This is the only mutation for screenings; there is no updateScreening.
export async function createScreeningAction(input: unknown): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const parsed = screeningSchema.safeParse(input);
  if (!parsed.success) return { ok: false, fieldErrors: zodFieldErrors(parsed.error) };
  const data = parsed.data;

  const clinicalAnswers = Object.fromEntries(
    clinicalQuestions.map((q) => [q.key, data[q.key]])
  ) as Record<ClinicalQuestionKey, boolean> as ClinicalAnswers;
  const status = calculateStatus(clinicalAnswers);

  const reference = await generateUniqueReference(async (candidate) => {
    const existing = await prisma.screening.findUnique({ where: { reference: candidate } });
    return Boolean(existing);
  });

  const screening = await prisma.screening.create({
    data: {
      reference,
      userId: user.id,
      status,
      fullName: data.fullName,
      department: data.department,
      age: data.age,
      sex: data.sex,
      phone: data.phone,
      email: data.email || null,
      purpose: data.purpose,
      purposeOther: data.purpose === "OTHER" ? data.purposeOther ?? null : null,
      fromCountry: data.fromCountry,
      destination: data.destination,
      departureDate: new Date(data.departureDate),
      returnDate: data.returnDate ? new Date(data.returnDate) : null,
      flight: data.flight || null,
      ...clinicalAnswers,
      declarationAccepted: data.declarationAccepted,
    },
  });

  redirect(`/screenings/${screening.id}`);
}
