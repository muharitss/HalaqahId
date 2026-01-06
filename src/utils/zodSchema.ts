import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export const setoranSchema = z.object({
  santri_id: z.coerce.number().min(1, "Pilih santri"),
  tanggal: z.date(),
  surah: z.string().min(1, "Nama surah wajib diisi"),
  ayat_mulai: z.coerce.number().min(1, "Minimal ayat 1"),
  ayat_selesai: z.coerce.number().min(1, "Minimal ayat 1"),
  nilai: z.coerce.number().min(0).max(100),
  catatan: z.string().default(""), 
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SetoranFormValues = z.infer<typeof setoranSchema>;