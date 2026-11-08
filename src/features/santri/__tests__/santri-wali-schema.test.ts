import { describe, it, expect } from "vitest";
import { santriWaliSchema } from "../validation/santri-wali.schema.ts";

describe("santriWaliSchema validation", () => {
  it("should reject empty nama_wali", () => {
    const emptyName = santriWaliSchema.safeParse({
      nama_wali: "",
      hubungan: "AYAH",
    });
    expect(emptyName.success).toBe(false);
  });

  it("should reject invalid hubungan", () => {
    const invalidHubungan = santriWaliSchema.safeParse({
      nama_wali: "Ahmad",
      hubungan: "TEMAN",
    });
    expect(invalidHubungan.success).toBe(false);
  });

  it("should accept valid minimal data", () => {
    const validMinimal = santriWaliSchema.safeParse({
      nama_wali: "Hendra Gunawan",
      hubungan: "AYAH",
    });
    expect(validMinimal.success).toBe(true);
  });

  it("should reject short phone number", () => {
    const shortPhone = santriWaliSchema.safeParse({
      nama_wali: "Hendra Gunawan",
      hubungan: "AYAH",
      no_telepon: "12345",
    });
    expect(shortPhone.success).toBe(false);
  });

  it("should accept valid phone number", () => {
    const validPhone = santriWaliSchema.safeParse({
      nama_wali: "Hendra Gunawan",
      hubungan: "AYAH",
      no_telepon: "081234567890",
    });
    expect(validPhone.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const invalidEmail = santriWaliSchema.safeParse({
      nama_wali: "Hendra Gunawan",
      hubungan: "AYAH",
      email: "bukan-email",
    });
    expect(invalidEmail.success).toBe(false);
  });
});
