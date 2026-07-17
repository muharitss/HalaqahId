import { z } from "zod";

export const targetSchema = z
  .object({
    nama_target: z.string().min(3, "Nama target minimal 3 karakter"),
    id_kategori: z.coerce.number({ message: "Kategori setoran wajib dipilih" }).min(1, "Kategori setoran wajib dipilih"),
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
    hari_aktif: z
      .array(z.number().int().min(0).max(6))
      .nullable()
      .optional(),
    start_juz: z.coerce.number().min(1, "Juz minimal 1").max(30, "Juz maksimal 30").nullable().optional(),
    end_juz: z.coerce.number().min(1, "Juz minimal 1").max(30, "Juz maksimal 30").nullable().optional(),
    daftar_surat: z.string().max(200, "Maksimal 200 karakter").nullable().optional(),
    arah: z.enum(["MAJU", "MUNDUR", "BEBAS"]).default("BEBAS"),
  })
  .superRefine((data, ctx) => {
    if (data.tipe === "HARIAN" && data.hari_aktif !== null && data.hari_aktif !== undefined) {
      if (data.hari_aktif.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["hari_aktif"],
          message: "Pilih minimal 1 hari setoran aktif",
        });
      }
    }

    if (
      (data.start_juz !== null && data.start_juz !== undefined && !isNaN(data.start_juz)) ||
      (data.end_juz !== null && data.end_juz !== undefined && !isNaN(data.end_juz))
    ) {
      if (data.start_juz === null || data.start_juz === undefined || isNaN(data.start_juz)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["start_juz"],
          message: "Mulai Juz wajib diisi jika Selesai Juz ditentukan",
        });
      } else if (data.end_juz === null || data.end_juz === undefined || isNaN(data.end_juz)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["end_juz"],
          message: "Selesai Juz wajib diisi jika Mulai Juz ditentukan",
        });
      } else if (data.start_juz > data.end_juz) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["start_juz"],
          message: "Mulai Juz tidak boleh lebih besar dari Selesai Juz",
        });
      }
    }
  });

export type TargetFormValues = z.infer<typeof targetSchema>;
