import { clinicalQuestions, type ClinicalQuestionKey } from "./questions";

export type ScreeningStatus = "CLEAR" | "REVIEW_NEEDED";

export type ClinicalAnswers = Record<ClinicalQuestionKey, boolean>;

// REVIEW_NEEDED the moment any of questions 1-8 (the contact/own-exposure
// ones) is Yes — the two awareness questions never trigger it.
export function calculateStatus(answers: ClinicalAnswers): ScreeningStatus {
  const anyTrigger = clinicalQuestions.some(
    (q) => q.triggersReview && answers[q.key] === true
  );
  return anyTrigger ? "REVIEW_NEEDED" : "CLEAR";
}

export function triggeringQuestionLabels(answers: ClinicalAnswers): string[] {
  return clinicalQuestions
    .filter((q) => q.triggersReview && answers[q.key] === true)
    .map((q) => q.shortLabel);
}
