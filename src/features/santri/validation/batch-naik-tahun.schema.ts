import { z } from "zod";

export const batchNaikTahunSantriItemSchema = z.object({
  id_santri: z.coerce.number().positive("ID santri tidak valid"),
  action: z.enum(["NAIK", "TETAP", "LULUS", "KELUAR"]).default("NAIK"),
  id_level_baru: z.coerce.number().positive().optional().nullable(),
  id_halaqah_baru: z.coerce.number().positive().optional().nullable(),
  alasan: z.string().max(255, "Alasan maksimal 255 karakter").optional().nullable().or(z.literal("")),
});

export const batchNaikTahunSchema = z.object({
  id_tahun_ajaran_baru: z.coerce.number().positive("Pilih tahun ajaran baru"),
  santri_list: z.array(batchNaikTahunSantriItemSchema).optional(),
});

export type BatchNaikTahunSantriItemValues = z.infer<typeof batchNaikTahunSantriItemSchema>;
export type BatchNaikTahunFormValues = z.infer<typeof batchNaikTahunSchema>;
