import { z } from "zod";

export const profileFormSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  nama_lengkap: z.string().min(2, "Nama lengkap minimal 2 karakter").optional(),
  nomor_telepon: z
    .string()
    .regex(/^([0-9+\-\s]{8,20})?$/, "Format nomor telepon tidak valid")
    .optional()
    .or(z.literal("")),
  bio: z.string().max(500, "Bio maksimal 500 karakter").optional().or(z.literal("")),
  spesialisasi: z.string().max(150, "Spesialisasi maksimal 150 karakter").optional().or(z.literal("")),
  no_ijazah: z.string().max(100, "Nomor ijazah maksimal 100 karakter").optional().or(z.literal("")),
  foto: z.string().nullable().optional(),
  foto_url: z.string().nullable().optional(),
});

export type ProfileFormSchemaValues = z.infer<typeof profileFormSchema>;
