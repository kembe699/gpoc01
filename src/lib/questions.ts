// Single source of truth for every clinical question's wording. The form,
// the QR pass page, the PDF, and the QR code's plain-text summary all
// render from this file, so changing a question's wording only needs to
// happen here.

export type ClinicalQuestionKey =
  | "contactFever"
  | "contactGI"
  | "contactAches"
  | "contactWeakness"
  | "contactBleeding"
  | "ownSymptoms21d"
  | "bodyFluidContact"
  | "burialContact"
  | "awarenessReceived"
  | "followingPrecautions";

export type ClinicalQuestion = {
  key: ClinicalQuestionKey;
  section: "contact" | "own" | "awareness";
  // The full question text shown on the form.
  formLabel: string;
  // The short label used on the pass page, PDF, and QR text summary.
  shortLabel: string;
  // A "Yes" to this question is a potential exposure that should trigger
  // REVIEW_NEEDED. Awareness questions never do.
  triggersReview: boolean;
};

export const contactIntro =
  "In the past 21 days, have you been in contact with anyone who had:";

export const clinicalQuestions: ClinicalQuestion[] = [
  {
    key: "contactFever",
    section: "contact",
    formLabel: "Fever?",
    shortLabel: "Contact w/ fever",
    triggersReview: true,
  },
  {
    key: "contactGI",
    section: "contact",
    formLabel: "Diarrhoea or vomiting?",
    shortLabel: "Contact w/ diarrhoea/vomiting",
    triggersReview: true,
  },
  {
    key: "contactAches",
    section: "contact",
    formLabel: "Muscle and joint aches or pain?",
    shortLabel: "Contact w/ muscle/joint pain",
    triggersReview: true,
  },
  {
    key: "contactWeakness",
    section: "contact",
    formLabel: "Profound weakness or fatigue?",
    shortLabel: "Contact w/ weakness/fatigue",
    triggersReview: true,
  },
  {
    key: "contactBleeding",
    section: "contact",
    formLabel: "Bleeding into the skin, eyes or urine?",
    shortLabel: "Contact w/ bleeding",
    triggersReview: true,
  },
  {
    key: "ownSymptoms21d",
    section: "own",
    formLabel: "Have you had any of the symptoms above yourself in the past 21 days?",
    shortLabel: "Own symptoms (21d)",
    triggersReview: true,
  },
  {
    key: "bodyFluidContact",
    section: "own",
    formLabel:
      "Have you had direct contact with blood, vomit or saliva from a suspected or confirmed Ebola case?",
    shortLabel: "Body-fluid contact",
    triggersReview: true,
  },
  {
    key: "burialContact",
    section: "own",
    formLabel:
      "Have you taken part in a burial, or handled the body of someone suspected or confirmed to have died from Ebola?",
    shortLabel: "Burial/body handling",
    triggersReview: true,
  },
  {
    key: "awarenessReceived",
    section: "awareness",
    formLabel: "Have you received Ebola awareness training?",
    shortLabel: "EVD awareness received",
    triggersReview: false,
  },
  {
    key: "followingPrecautions",
    section: "awareness",
    formLabel: "Are you following the recommended prevention measures?",
    shortLabel: "Following precautions",
    triggersReview: false,
  },
];

export const declarationText =
  "I confirm that the information above is true and complete. I will report to the GPOC clinic immediately if I develop any Ebola symptoms within 21 days of travel.";
