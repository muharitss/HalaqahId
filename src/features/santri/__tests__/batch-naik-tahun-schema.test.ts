import { batchNaikTahunSchema, batchNaikTahunSantriItemSchema } from "../validation/batch-naik-tahun.schema.ts";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// 1. Missing id_tahun_ajaran_baru
const missingTahun = batchNaikTahunSchema.safeParse({});
assert(!missingTahun.success, "Missing id_tahun_ajaran_baru should fail");

// 2. Invalid id_tahun_ajaran_baru (zero or negative)
const invalidTahun = batchNaikTahunSchema.safeParse({ id_tahun_ajaran_baru: 0 });
assert(!invalidTahun.success, "Zero id_tahun_ajaran_baru should fail");

// 3. Valid batch with empty santri_list (auto-process backend mode)
const validEmptyList = batchNaikTahunSchema.safeParse({ id_tahun_ajaran_baru: 1 });
assert(validEmptyList.success, "Valid request with empty santri_list should succeed");

// 4. Valid batch with items
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
assert(validWithItems.success, "Valid batch with items should succeed");

// 5. Invalid action in santri item
const invalidAction = batchNaikTahunSantriItemSchema.safeParse({
  id_santri: 10,
  action: "MUTASI",
});
assert(!invalidAction.success, "Invalid action should fail");

// 6. Action default to NAIK
const defaultAction = batchNaikTahunSantriItemSchema.safeParse({
  id_santri: 10,
});
assert(defaultAction.success && defaultAction.data.action === "NAIK", "Default action should be NAIK");

console.log("Batch naik tahun schema tests passed successfully!");
