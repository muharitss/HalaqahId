import { describe, it, expect } from "vitest";
import { ajukanIzinSchema, approvalIzinSchema } from "../validation/izin.schema";
import { JenisIzin } from "../types";

describe("izinValidation", () => {
  it("should accept valid pengajuan izin", () => {
    const validData = ajukanIzinSchema.safeParse({
      id_santri: 1,
      jenis: JenisIzin.SAKIT,
      alasan: "Demam tinggi dan perlu istirahat",
      tanggal_mulai: "2026-11-10",
      tanggal_selesai: "2026-11-12",
    });
    expect(validData.success).toBe(true);
  });

  it("should reject zero or empty id_santri", () => {
    const invalidSantri = ajukanIzinSchema.safeParse({
      id_santri: 0,
      jenis: JenisIzin.IZIN,
      alasan: "Keperluan keluarga",
      tanggal_mulai: "2026-11-10",
      tanggal_selesai: "2026-11-10",
    });
    expect(invalidSantri.success).toBe(false);
  });

  it("should reject alasan under 3 chars", () => {
    const shortAlasan = ajukanIzinSchema.safeParse({
      id_santri: 1,
      jenis: JenisIzin.IZIN,
      alasan: "ab",
      tanggal_mulai: "2026-11-10",
      tanggal_selesai: "2026-11-10",
    });
    expect(shortAlasan.success).toBe(false);
  });

  it("should reject end date earlier than start date", () => {
    const invalidDateRange = ajukanIzinSchema.safeParse({
      id_santri: 1,
      jenis: JenisIzin.IZIN,
      alasan: "Acara keluarga penting",
      tanggal_mulai: "2026-11-15",
      tanggal_selesai: "2026-11-10",
    });
    expect(invalidDateRange.success).toBe(false);
  });

  it("should validate approval schema with optional catatan", () => {
    const approval = approvalIzinSchema.safeParse({
      status: "APPROVED",
      catatan_persetujuan: "Semoga lekas sembuh",
    });
    expect(approval.success).toBe(true);
  });
});
