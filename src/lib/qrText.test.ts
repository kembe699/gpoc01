import { describe, it, expect } from "vitest";
import { buildQrText, type ScreeningForQrText } from "./qrText";

const base: ScreeningForQrText = {
  reference: "EVD-20261019-4F2A",
  submittedAt: new Date("2026-10-19T17:30:00Z"), // 20:30 Africa/Kampala
  status: "CLEAR",
  fullName: "Jane Doe",
  department: "Operations",
  age: 34,
  sex: "FEMALE",
  phone: "+256700000000",
  purpose: "BUSINESS",
  purposeOther: null,
  fromCountry: "Uganda",
  destination: "Kenya, Nairobi",
  departureDate: new Date("2026-10-22"),
  returnDate: new Date("2026-10-29"),
  flight: "KQ412",
  contactFever: false,
  contactGI: false,
  contactAches: false,
  contactWeakness: false,
  contactBleeding: false,
  ownSymptoms21d: false,
  bodyFluidContact: false,
  burialContact: false,
  awarenessReceived: true,
  followingPrecautions: true,
};

describe("buildQrText", () => {
  it("matches the exact spec layout for a CLEAR result", () => {
    const text = buildQrText(base);
    expect(text).toBe(
      [
        "GPOC EVD TRAVEL SCREENING",
        "Ref: EVD-20261019-4F2A",
        "Submitted: 19 Oct 2026 20:30",
        "RESULT: CLEAR",
        "Name: Jane Doe",
        "Dept: Operations",
        "Age/Sex: 34 / Female",
        "Phone: +256700000000",
        "Purpose: Business",
        "From: Uganda  To: Kenya, Nairobi",
        "Depart: 22 Oct 2026  Return: 29 Oct 2026 (7 days)",
        "Flight: KQ412",
        "Contact w/ fever: No",
        "Contact w/ diarrhoea/vomiting: No",
        "Contact w/ muscle/joint pain: No",
        "Contact w/ weakness/fatigue: No",
        "Contact w/ bleeding: No",
        "Own symptoms (21d): No",
        "Body-fluid contact: No",
        "Burial/body handling: No",
        "EVD awareness received: Yes",
        "Following precautions: Yes",
        "Declaration: Signed",
      ].join("\n")
    );
  });

  it("lists the triggering answers in brackets after RESULT when REVIEW_NEEDED", () => {
    const reviewNeeded: ScreeningForQrText = {
      ...base,
      status: "REVIEW_NEEDED",
      contactFever: true,
      burialContact: true,
    };
    const text = buildQrText(reviewNeeded);
    const resultLine = text.split("\n")[3];
    expect(resultLine).toBe("RESULT: REVIEW_NEEDED (Contact w/ fever, Burial/body handling)");
  });

  it("uses an em dash placeholder when there's no return date or flight", () => {
    const noReturn: ScreeningForQrText = { ...base, returnDate: null, flight: null };
    const text = buildQrText(noReturn);
    expect(text).toContain("Depart: 22 Oct 2026  Return: —");
    expect(text).toContain("Flight: —");
  });

  it("uses purposeOther when purpose is OTHER", () => {
    const other: ScreeningForQrText = { ...base, purpose: "OTHER", purposeOther: "Conference" };
    const text = buildQrText(other);
    expect(text).toContain("Purpose: Conference");
  });
});
