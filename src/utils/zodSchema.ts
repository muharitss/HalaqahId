import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export const setoranSchema = z.object({
  santri_id: z.coerce.number().min(1, "Pilih santri"),
  juz: z.coerce.number().min(1, "Juz 1-30").max(30, "Juz 1-30"),
  surat: z.string().min(1, "Nama surah wajib diisi"), 
  ayat: z.string().min(1, "Ayat wajib diisi"),
  kategori: z.enum(["HAFALAN", "MURAJAAH"]),
  taqwim: z.string().optional(), 
  keterangan: z.string().optional(), 
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

export const halaqahSchema = z.object({
  name_halaqah: z.string().min(3, "Nama halaqah minimal 3 karakter"),
  muhafiz_id: z.coerce.number().min(1, "Pilih Muhafidz"),
});

export const santriSchema = z.object({
  nama_santri: z.string().min(3, "Nama santri minimal 3 karakter"),
  nomor_telepon: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(15, "Nomor telepon maksimal 15 digit")
    .regex(/^[0-9]+$/, "Nomor telepon hanya boleh berisi angka"),
  target: z.enum(["RINGAN", "SEDANG", "INTENSE"]),
  halaqah_id: z.coerce.number().min(1, "Pilih halaqah").optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SetoranFormValues = z.infer<typeof setoranSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type HalaqahFormValues = z.infer<typeof halaqahSchema>;
export type SantriFormValues = z.infer<typeof santriSchema>;
