import * as z from "zod";

export const setoranSchema = z
  .object({
    id_santri: z.coerce.number().min(1, "Pilih santri"),
    juz: z.coerce.number().min(1).max(30),
    surat: z.string().min(1, "Surah wajib dipilih"),
    // Kita gunakan field helper untuk UI
    ayat_mulai: z.coerce.number().min(1),
    ayat_selesai: z.coerce.number().min(1),
    id_kategori: z.coerce.number().min(1, "Kategori wajib dipilih"),
    taqwim: z.coerce.number().optional(),
    keterangan: z.string().optional(),
  })
  .refine((data) => data.ayat_selesai >= data.ayat_mulai, {
    message: "Ayat selesai tidak boleh lebih kecil dari mulai",
    path: ["ayat_selesai"],
  });

export const halaqahSchema = z.object({
  name_halaqah: z.string().min(3, "Nama halaqah minimal 3 karakter"),
  id_muhafiz: z.coerce.number().min(1, "Pilih Muhafidz"),
});

export const santriSchema = z.object({
  nama_santri: z.string().min(3, "Nama santri minimal 3 karakter"),
  nomor_telepon: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(15, "Nomor telepon maksimal 15 digit")
    .regex(/^[0-9]+$/, "Nomor telepon hanya boleh berisi angka"),
  /** id_target nullable — santri boleh tidak memiliki target */
  id_target: z.coerce.number().nullable().optional(),
  id_halaqah: z.coerce.number().min(1, "Pilih halaqah").optional(),
});

/** Schema untuk membuat/mengedit TargetSekolah */
export const targetSchema = z.object({
  nama_target: z.string().min(3, "Nama target minimal 3 karakter"),
  tipe: z.enum(["HARIAN", "MINGGUAN", "BULANAN", "SEMESTER", "GLOBAL"], {
    message: "Pilih tipe periode target",
  }),
  nilai_target: z.coerce
    .number({ message: "Nilai target wajib diisi" })
    .positive("Nilai target harus lebih dari 0")
    .max(1000, "Nilai target terlalu besar"),
  satuan: z.enum(["BARIS", "HALAMAN", "AYAT", "JUZ"], {
    message: "Pilih satuan target",
  }),
  deskripsi: z.string().max(300, "Deskripsi maksimal 300 karakter").optional().nullable(),
});

export type SetoranFormValues = z.infer<typeof setoranSchema>;
export type HalaqahFormValues = z.infer<typeof halaqahSchema>;
export type SantriFormValues = z.infer<typeof santriSchema>;
export type TargetFormValues = z.infer<typeof targetSchema>;
