import * as z from "zod";

export const halaqahSchema = z.object({
  nama_halaqah: z.string().min(3, "Nama halaqah minimal 3 karakter"),
  kode_halaqah: z.string().min(3, "Kode halaqah minimal 3 karakter"),
  deskripsi: z.string().optional(),
  id_muhafidz: z.number().min(1, "Pilih muhafidz pengampu"),
  hari: z.enum(["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"]),
  jam_mulai: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format jam tidak valid"),
  jam_selesai: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format jam tidak valid"),
  lokasi: z.string().min(3, "Lokasi minimal 3 karakter"),
  kapasitas_maks: z.number().min(1, "Kapasitas minimal 1").max(50, "Kapasitas maksimal 50"),
  status: z.enum(["aktif", "nonaktif", "penuh"]).default("aktif"),
});

// Cek apakah type inference benar:
export type HalaqahFormData = z.infer<typeof halaqahSchema>;