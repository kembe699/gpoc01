import { describe, it, expect } from "vitest";
import { screeningSchema, kampalaTodayStr } from "./screening";
import { clinicalQuestions } from "../questions";

function futureDate(daysFromToday: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().split("T")[0];
}

function validBase() {
  const clinical = Object.fromEntries(clinicalQuestions.map((q) => [q.key, false]));
  return {
    fullName: "Jane Doe",
    department: "Operations",
    age: 34,
    sex: "FEMALE" as const,
    phone: "+256700000000",
    email: "jane@gpoc.co.ug",
    purpose: "BUSINESS" as const,
    purposeOther: "",
    fromCountry: "Uganda",
    destination: "Kenya, Nairobi",
    departureDate: futureDate(3),
    returnDate: futureDate(10),
    flight: "KQ412",
    ...clinical,
    declarationAccepted: true,
  };
}

describe("screeningSchema", () => {
  it("accepts a fully valid submission", () => {
    const result = screeningSchema.safeParse(validBase());
    expect(result.success).toBe(true);
  });

  it("rejects a departure date in the past", () => {
    const result = screeningSchema.safeParse({ ...validBase(), departureDate: "2000-01-01" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "departureDate")).toBe(true);
    }
  });

  it("rejects a return date before the departure date", () => {
    const result = screeningSchema.safeParse({
      ...validBase(),
      departureDate: futureDate(10),
      returnDate: futureDate(3),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "returnDate")).toBe(true);
    }
  });

  it("requires purposeOther when purpose is OTHER", () => {
    const result = screeningSchema.safeParse({ ...validBase(), purpose: "OTHER", purposeOther: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "purposeOther")).toBe(true);
    }
  });

  it("accepts OTHER when purposeOther is filled in", () => {
    const result = screeningSchema.safeParse({
      ...validBase(),
      purpose: "OTHER",
      purposeOther: "Conference",
    });
    expect(result.success).toBe(true);
  });

  it("rejects age outside 16-90", () => {
    expect(screeningSchema.safeParse({ ...validBase(), age: 15 }).success).toBe(false);
    expect(screeningSchema.safeParse({ ...validBase(), age: 91 }).success).toBe(false);
    expect(screeningSchema.safeParse({ ...validBase(), age: 16 }).success).toBe(true);
    expect(screeningSchema.safeParse({ ...validBase(), age: 90 }).success).toBe(true);
  });

  it("requires the declaration to be accepted", () => {
    const result = screeningSchema.safeParse({ ...validBase(), declarationAccepted: false });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path[0] === "declarationAccepted")).toBe(true);
    }
  });
});

describe("kampalaTodayStr", () => {
  it("returns a YYYY-MM-DD string", () => {
    expect(kampalaTodayStr()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
