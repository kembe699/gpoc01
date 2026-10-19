import { describe, it, expect, vi } from "vitest";
import { buildReferenceCandidate, generateUniqueReference, REFERENCE_PATTERN } from "./reference";

describe("buildReferenceCandidate", () => {
  it("matches EVD-YYYYMMDD-XXXX", () => {
    const candidate = buildReferenceCandidate(new Date("2026-10-19T12:00:00Z"));
    expect(candidate).toMatch(REFERENCE_PATTERN);
    expect(candidate.startsWith("EVD-20261019-")).toBe(true);
  });

  it("always has a 4-character uppercase/digit suffix", () => {
    for (let i = 0; i < 20; i++) {
      const candidate = buildReferenceCandidate();
      const suffix = candidate.split("-")[2];
      expect(suffix).toHaveLength(4);
      expect(suffix).toMatch(/^[A-Z0-9]{4}$/);
    }
  });
});

describe("generateUniqueReference", () => {
  it("returns the first candidate when it doesn't already exist", async () => {
    const exists = vi.fn().mockResolvedValue(false);
    const ref = await generateUniqueReference(exists);
    expect(ref).toMatch(REFERENCE_PATTERN);
    expect(exists).toHaveBeenCalledTimes(1);
  });

  it("retries until it finds a reference that doesn't collide", async () => {
    const exists = vi
      .fn()
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);
    const ref = await generateUniqueReference(exists);
    expect(ref).toMatch(REFERENCE_PATTERN);
    expect(exists).toHaveBeenCalledTimes(3);
  });

  it("gives up after maxAttempts collisions", async () => {
    const exists = vi.fn().mockResolvedValue(true);
    await expect(generateUniqueReference(exists, 3)).rejects.toThrow();
    expect(exists).toHaveBeenCalledTimes(3);
  });
});
