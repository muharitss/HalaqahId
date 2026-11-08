import { describe, it, expect } from "vitest";
import { pengumumanFormSchema } from "@/features/pengumuman/modules/form/validation/pengumumanSchema";
import { PRESET_NATIONAL_HOLIDAYS } from "@/features/akademik/components/NationalHolidaysImportModal";
import { profileFormSchema } from "@/features/profil/validation/profile.schema";
import { portalLoginSchema } from "@/features/portal/validation/portal.schema";
import { targetSchema } from "@/features/settings/modules/target/validation/target.schema";

describe("Contract checks for frontend schemas & constants", () => {
  describe("Pengumuman schema", () => {
    it("should accept valid announcement payload", () => {
      const valid = {
        judul: "Libur Ramadhan 1448 H",
        isi: "Kegiatan halaqah diliburkan mulai awal Ramadhan.",
        prioritas: "URGENT",
        is_pinned: true,
        tanggal_mulai: "2026-03-01T08:00",
        tanggal_selesai: "2026-03-10T17:00",
        target_type: "ALL",
        target_id: null,
      };
      const result = pengumumanFormSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should reject invalid priority", () => {
      const invalid = {
        judul: "Pengumuman",
        isi: "Konten pengumuman penting",
        prioritas: "LOW",
        is_pinned: false,
        target_type: "ALL",
      };
      const result = pengumumanFormSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("Akademik presets", () => {
    it("should contain preset holidays for 2026 and 2027", () => {
      expect(Array.isArray(PRESET_NATIONAL_HOLIDAYS[2026])).toBe(true);
      expect(PRESET_NATIONAL_HOLIDAYS[2026].length).toBeGreaterThanOrEqual(10);
      expect(Array.isArray(PRESET_NATIONAL_HOLIDAYS[2027])).toBe(true);
      for (const h of [...PRESET_NATIONAL_HOLIDAYS[2026], ...PRESET_NATIONAL_HOLIDAYS[2027]]) {
        expect(/^\d{4}-\d{2}-\d{2}$/.test(h.tanggal)).toBe(true);
        expect(h.keterangan.trim().length).toBeGreaterThan(0);
      }
    });
  });

  describe("Profil schema", () => {
    it("should validate profile with name and optional fields", () => {
      const valid = {
        name: "Ustadz Ahmad",
        nama_lengkap: "Ahmad Dahlan, Lc.",
        nomor_telepon: "081234567890",
        bio: "Pengajar tahfidz al-quran",
      };
      const result = profileFormSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });
  });

  describe("Portal schema", () => {
    it("should validate portal login credentials", () => {
      const valid = {
        slug_sekolah: "pesantren-darul-quran",
        nis: "2026001",
        no_telepon: "081234567890",
      };
      const result = portalLoginSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });
  });

  describe("Target schema", () => {
    it("should validate target with positive nilai_target", () => {
      const valid = {
        nama_target: "Target Harian 1 Halaman",
        id_kategori: 1,
        tipe: "HARIAN",
        nilai_target: 1,
        satuan: "HALAMAN",
        hari_aktif: [1, 2, 3, 4, 5],
        arah: "BEBAS",
      };
      const result = targetSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });
  });
});
