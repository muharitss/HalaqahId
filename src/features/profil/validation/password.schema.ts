import { z } from "zod";

export const gantiPasswordSchema = z
  .object({
    password_lama: z.string().min(1, "Password lama harus diisi"),
    password_baru: z.string().min(6, "Password baru minimal 6 karakter"),
    konfirmasi_password: z.string().min(1, "Konfirmasi password harus diisi"),
  })
  .refine((data) => data.password_baru === data.konfirmasi_password, {
    message: "Konfirmasi password tidak cocok",
    path: ["konfirmasi_password"],
  });

export type GantiPasswordSchemaValues = z.infer<typeof gantiPasswordSchema>;
