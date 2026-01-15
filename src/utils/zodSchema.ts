import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export const setoranSchema = z.object({
  santri_id: z.coerce.number().min(1, "Pilih santri"),
  tanggal: z.date(),
  juz: z.coerce.number().min(1, "Juz 1-30").max(30, "Juz 1-30"),
  
  kategori: z.string().refine((val) => ["HAFALAN", "MURAJAAH"].includes(val), {
    message: "Kategori harus HAFALAN atau MURAJAAH",
  }),

  surah: z.string().min(1, "Nama surah wajib diisi"),
  ayat_mulai: z.coerce.number().min(1, "Minimal ayat 1"),
  ayat_selesai: z.coerce.number().min(1, "Minimal ayat 1"),
  nilai: z.coerce.number().min(0).max(100),
  catatan: z.string().optional().default(""),
});

export const registerSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"]
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SetoranFormValues = z.infer<typeof setoranSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
