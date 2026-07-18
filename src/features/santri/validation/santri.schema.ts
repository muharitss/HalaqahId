import { z } from "zod";

export const santriSchema = z.object({
  nama_santri: z.string().min(3, "Nama santri minimal 3 karakter"),
  nomor_telepon: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(15, "Nomor telepon maksimal 15 digit")
    .regex(/^[0-9]+$/, "Nomor telepon hanya boleh berisi angka")
    .optional()
    .or(z.literal("")),
  id_target: z.coerce.number().nullable().optional(),
  id_halaqah: z.coerce.number().min(1, "Pilih halaqah").optional(),
});

export type SantriFormValues = z.infer<typeof santriSchema>;
