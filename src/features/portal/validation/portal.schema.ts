import { z } from "zod";

export const portalLoginSchema = z.object({
  slug_sekolah: z
    .string()
    .trim()
    .min(1, "Slug sekolah wajib diisi"),
  nis: z
    .string()
    .trim()
    .min(1, "Nomor Induk Santri (NIS) wajib diisi"),
  no_telepon: z
    .string()
    .trim()
    .min(9, "Nomor telepon wali minimal 9 digit")
    .regex(/^[0-9+-\s]+$/, "Format nomor telepon tidak valid"),
});

export type PortalLoginFormData = z.infer<typeof portalLoginSchema>;
