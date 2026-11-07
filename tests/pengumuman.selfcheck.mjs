import assert from "node:assert";
import { z } from "zod";

const pengumumanFormSchema = z.object({
  judul: z
    .string()
    .min(3, "Judul pengumuman minimal 3 karakter")
    .max(255, "Judul maksimal 255 karakter"),
  isi: z
    .string()
    .min(5, "Isi pengumuman minimal 5 karakter"),
  prioritas: z.enum(["NORMAL", "PENTING", "URGENT"]),
  is_pinned: z.boolean(),
  tanggal_mulai: z.string().optional().nullable(),
  tanggal_selesai: z.string().optional().nullable(),
  target_type: z.enum(["ALL", "HALAQAH", "LEVEL", "SANTRI", "ROLE", "USER"]),
  target_id: z.number().optional().nullable(),
});

console.log("Running self-check tests for fitur Pengumuman...");

// Test 1: Valid form data
const validData = {
  judul: "Libur Ramadhan 1448 H",
  isi: "Diberitahukan kegiatan halaqah diliburkan mulai tanggal 1 Ramadhan.",
  prioritas: "PENTING",
  is_pinned: true,
  tanggal_mulai: "2026-03-01T08:00",
  tanggal_selesai: "2026-03-10T17:00",
  target_type: "ALL",
  target_id: null,
};
const parsed = pengumumanFormSchema.safeParse(validData);
assert(parsed.success, "Valid pengumuman payload should succeed");

// Test 2: Invalid judul (too short)
const invalidJudul = { ...validData, judul: "Hi" };
const resJudul = pengumumanFormSchema.safeParse(invalidJudul);
assert(!resJudul.success, "Short title should be rejected");

// Test 3: Invalid isi (too short)
const invalidIsi = { ...validData, isi: "abc" };
const resIsi = pengumumanFormSchema.safeParse(invalidIsi);
assert(!resIsi.success, "Short content should be rejected");

// Test 4: Invalid priority
const invalidPriority = { ...validData, prioritas: "LOW" };
const resPriority = pengumumanFormSchema.safeParse(invalidPriority);
assert(!resPriority.success, "Invalid priority enum should be rejected");

// Test 5: Target specific halaqah
const halaqahTarget = {
  ...validData,
  target_type: "HALAQAH",
  target_id: 12,
};
const resHalaqah = pengumumanFormSchema.safeParse(halaqahTarget);
assert(resHalaqah.success, "Target HALAQAH with ID should succeed");

console.log("All Pengumuman self-check tests passed successfully! ✅");
