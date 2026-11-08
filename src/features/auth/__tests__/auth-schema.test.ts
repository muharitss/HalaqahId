import { describe, it, expect } from "vitest";
import {
  forgotPasswordSchema,
  resetPasswordPublicSchema,
} from "../validation/auth.schema.ts";

describe("authSchema validation", () => {
  describe("forgotPasswordSchema", () => {
    it("should reject empty email", () => {
      const emptyRes = forgotPasswordSchema.safeParse({ email: "" });
      expect(emptyRes.success).toBe(false);
    });

    it("should reject invalid email format", () => {
      const invalidRes = forgotPasswordSchema.safeParse({ email: "invalid-email" });
      expect(invalidRes.success).toBe(false);
    });

    it("should accept valid email", () => {
      const validEmailRes = forgotPasswordSchema.safeParse({ email: "user@example.com" });
      expect(validEmailRes.success).toBe(true);
    });
  });

  describe("resetPasswordPublicSchema", () => {
    it("should reject short password (<8 chars)", () => {
      const shortPassRes = resetPasswordPublicSchema.safeParse({
        password_baru: "12345",
        confirmPassword: "12345",
      });
      expect(shortPassRes.success).toBe(false);
    });

    it("should reject mismatched passwords", () => {
      const mismatchRes = resetPasswordPublicSchema.safeParse({
        password_baru: "password123",
        confirmPassword: "different123",
      });
      expect(mismatchRes.success).toBe(false);
    });

    it("should accept valid matching passwords", () => {
      const validPassRes = resetPasswordPublicSchema.safeParse({
        password_baru: "supersecret123",
        confirmPassword: "supersecret123",
      });
      expect(validPassRes.success).toBe(true);
    });
  });
});
