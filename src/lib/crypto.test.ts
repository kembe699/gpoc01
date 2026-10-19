import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, generateToken, hashToken } from "./crypto";

describe("password hashing", () => {
  it("verifies a correct password against its hash", async () => {
    const hash = await hashPassword("Correct1Password");
    expect(await verifyPassword("Correct1Password", hash)).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("Correct1Password");
    expect(await verifyPassword("WrongPassword1", hash)).toBe(false);
  });

  it("never stores the plain password in the hash", async () => {
    const hash = await hashPassword("Correct1Password");
    expect(hash).not.toContain("Correct1Password");
  });
});

describe("session tokens", () => {
  it("generates a different token each call", () => {
    const a = generateToken();
    const b = generateToken();
    expect(a).not.toBe(b);
  });

  it("hashes a token deterministically (same input, same hash)", () => {
    const token = generateToken();
    expect(hashToken(token)).toBe(hashToken(token));
  });

  it("produces a 64-character hex SHA-256 digest", () => {
    const hash = hashToken("any-token-value");
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("never stores the raw token as its own hash", () => {
    const token = generateToken();
    expect(hashToken(token)).not.toBe(token);
  });
});
