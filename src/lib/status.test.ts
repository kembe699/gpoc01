import { describe, it, expect } from "vitest";
import { calculateStatus, triggeringQuestionLabels, type ClinicalAnswers } from "./status";
import { clinicalQuestions } from "./questions";

const allClear: ClinicalAnswers = Object.fromEntries(
  clinicalQuestions.map((q) => [q.key, false])
) as ClinicalAnswers;

describe("calculateStatus", () => {
  it("is CLEAR when every answer is No", () => {
    expect(calculateStatus(allClear)).toBe("CLEAR");
  });

  it("is REVIEW_NEEDED when any contact/own-exposure question is Yes", () => {
    for (const q of clinicalQuestions.filter((q) => q.triggersReview)) {
      const answers = { ...allClear, [q.key]: true };
      expect(calculateStatus(answers)).toBe("REVIEW_NEEDED");
    }
  });

  it("stays CLEAR when only the awareness questions are Yes", () => {
    const answers = { ...allClear, awarenessReceived: true, followingPrecautions: true };
    expect(calculateStatus(answers)).toBe("CLEAR");
  });
});

describe("triggeringQuestionLabels", () => {
  it("lists only the contact/own-exposure questions that are Yes", () => {
    const answers = { ...allClear, contactFever: true, burialContact: true, awarenessReceived: true };
    expect(triggeringQuestionLabels(answers)).toEqual(["Contact w/ fever", "Burial/body handling"]);
  });

  it("returns an empty list when nothing triggered", () => {
    expect(triggeringQuestionLabels(allClear)).toEqual([]);
  });
});
