import { ajukanIzinSchema, approvalIzinSchema } from "../validation/izin.schema";
import { JenisIzin } from "../types";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// 1. Valid data
const validData = ajukanIzinSchema.safeParse({
  id_santri: 1,
  jenis: JenisIzin.SAKIT,
  alasan: "Demam tinggi dan perlu istirahat",
  tanggal_mulai: "2026-11-10",
  tanggal_selesai: "2026-11-12",
});
assert(validData.success, "Valid pengajuan izin should pass");

// 2. Empty or missing id_santri
const invalidSantri = ajukanIzinSchema.safeParse({
  id_santri: 0,
  jenis: JenisIzin.IZIN,
  alasan: "Keperluan keluarga",
  tanggal_mulai: "2026-11-10",
  tanggal_selesai: "2026-11-10",
});
assert(!invalidSantri.success, "Zero id_santri should fail");

// 3. Short alasan
const shortAlasan = ajukanIzinSchema.safeParse({
  id_santri: 1,
  jenis: JenisIzin.IZIN,
  alasan: "ab",
  tanggal_mulai: "2026-11-10",
  tanggal_selesai: "2026-11-10",
});
assert(!shortAlasan.success, "Alasan under 3 chars should fail");

// 4. Invalid date range (tanggal_selesai earlier than tanggal_mulai)
const invalidDateRange = ajukanIzinSchema.safeParse({
  id_santri: 1,
  jenis: JenisIzin.IZIN,
  alasan: "Acara keluarga penting",
  tanggal_mulai: "2026-11-15",
  tanggal_selesai: "2026-11-10",
});
assert(!invalidDateRange.success, "End date earlier than start date should fail");

// 5. Approval schema optional note
const validApproval = approvalIzinSchema.safeParse({
  catatan_approval: "Disetujui untuk istirahat",
});
assert(validApproval.success, "Approval with note should pass");

const validEmptyApproval = approvalIzinSchema.safeParse({});
assert(validEmptyApproval.success, "Approval without note should pass");

console.log("All izin validation self-checks passed!");
