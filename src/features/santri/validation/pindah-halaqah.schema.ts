import { z } from "zod";

export const pindahHalaqahSchema = z.object({
  id_halaqah_baru: z.coerce.number().min(1, "Pilih halaqah tujuan"),
  alasan: z.string().max(255, "Alasan maksimal 255 karakter").optional().nullable().or(z.literal("")),
  tanggal_pindah: z.string().optional(),
});

export type PindahHalaqahFormValues = z.infer<typeof pindahHalaqahSchema>;
