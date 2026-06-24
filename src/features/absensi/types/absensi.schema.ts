import { z } from "zod";

export const absensiStatusSchema = z.enum(["HADIR", "IZIN", "SAKIT", "TERLAMBAT", "ALFA"] as const);

export const createAbsensiSantriSchema = z.object({
  id_santri: z.number(),
  id_sesi: z.number(),
  status: absensiStatusSchema,
  keterangan: z.string().optional(),
  tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
});

export const bulkCreateAbsensiSantriSchema = z.array(createAbsensiSantriSchema);

export type CreateAbsensiSantriInput = z.infer<typeof createAbsensiSantriSchema>;
export type AbsensiStatusType = z.infer<typeof absensiStatusSchema>;

export interface MonthlyAbsensiData {
  tanggal: string;
  data: {
    id_santri: number;
    id_sesi: number;
    status: AbsensiStatusType;
  }[];
}
