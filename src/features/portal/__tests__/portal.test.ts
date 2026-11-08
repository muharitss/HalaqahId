import { describe, it, expect } from "vitest";
import { portalLoginSchema } from "../validation/portal.schema";

describe("portalLoginSchema validation", () => {
  it("should reject empty slug_sekolah", () => {
    const emptySlug = portalLoginSchema.safeParse({
      slug_sekolah: "",
      nis: "NIS123",
      no_telepon: "081234567890",
    });
    expect(emptySlug.success).toBe(false);
  });

  it("should reject empty nis", () => {
    const emptyNis = portalLoginSchema.safeParse({
      slug_sekolah: "pesantren-nurul-quran",
      nis: "",
      no_telepon: "081234567890",
    });
    expect(emptyNis.success).toBe(false);
  });

  it("should reject short phone (<9 digits)", () => {
    const shortPhone = portalLoginSchema.safeParse({
      slug_sekolah: "pesantren-nurul-quran",
      nis: "NIS123",
      no_telepon: "1234",
    });
    expect(shortPhone.success).toBe(false);
  });

  it("should reject phone containing alphabets", () => {
    const invalidPhone = portalLoginSchema.safeParse({
      slug_sekolah: "pesantren-nurul-quran",
      nis: "NIS123",
      no_telepon: "0812abcde",
    });
    expect(invalidPhone.success).toBe(false);
  });

  it("should accept valid portal login payload", () => {
    const validPayload = portalLoginSchema.safeParse({
      slug_sekolah: "pesantren-nurul-quran",
      nis: "NIS2024001",
      no_telepon: "081234567890",
    });
    expect(validPayload.success).toBe(true);
    if (validPayload.success) {
      expect(validPayload.data.slug_sekolah).toBe("pesantren-nurul-quran");
      expect(validPayload.data.nis).toBe("NIS2024001");
      expect(validPayload.data.no_telepon).toBe("081234567890");
    }
  });
});
