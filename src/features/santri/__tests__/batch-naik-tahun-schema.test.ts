import { describe, it, expect } from "vitest";
import { batchNaikTahunSchema, batchNaikTahunSantriItemSchema } from "../validation/batch-naik-tahun.schema.ts";

describe("batchNaikTahunSchema validation", () => {
  it("should reject missing id_tahun_ajaran_baru", () => {
    const missingTahun = batchNaikTahunSchema.safeParse({});
    expect(missingTahun.success).toBe(false);
  });

  it("should reject zero id_tahun_ajaran_baru", () => {
    const invalidTahun = batchNaikTahunSchema.safeParse({ id_tahun_ajaran_baru: 0 });
    expect(invalidTahun.success).toBe(false);
  });

  it("should accept valid request with empty santri_list (auto-process)", () => {
    const validEmptyList = batchNaikTahunSchema.safeParse({ id_tahun_ajaran_baru: 1 });
    expect(validEmptyList.success).toBe(true);
  });

  it("should accept valid batch with items", () => {
    const validWithItems = batchNaikTahunSchema.safeParse({
      id_tahun_ajaran_baru: 2,
      santri_list: [
        {
          id_santri: 10,
          action: "NAIK",
          id_level_baru: 3,
          id_halaqah_baru: 4,
          alasan: "Naik level dari juz 5",
        },
        {
          id_santri: 11,
          action: "TETAP",
        },
        {
          id_santri: 12,
          action: "LULUS",
          alasan: "Selesai 30 juz",
        },
      ],
    });
    expect(validWithItems.success).toBe(true);
  });

  it("should reject invalid action in santri item", () => {
    const invalidAction = batchNaikTahunSantriItemSchema.safeParse({
      id_santri: 10,
      action: "MUTASI",
    });
    expect(invalidAction.success).toBe(false);
  });
});
