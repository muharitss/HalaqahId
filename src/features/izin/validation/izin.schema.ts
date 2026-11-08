import { z } from "zod";
import { JenisIzin } from "../types";

export const ajukanIzinSchema = z
  .object({
    id_santri: z
      .number({ message: "Santri wajib dipilih" })
      .min(1, "Santri wajib dipilih"),
    jenis: z.nativeEnum(JenisIzin, {
      message: "Jenis izin wajib dipilih",
    }),
    alasan: z
      .string()
      .trim()
      .min(3, "Alasan izin minimal 3 karakter")
      .max(500, "Alasan izin maksimal 500 karakter"),
    tanggal_mulai: z.string().min(1, "Tanggal mulai wajib diisi"),
    tanggal_selesai: z.string().min(1, "Tanggal selesai wajib diisi"),
  })
  .refine(
    (data) => {
      if (!data.tanggal_mulai || !data.tanggal_selesai) return true;
      return new Date(data.tanggal_selesai) >= new Date(data.tanggal_mulai);
    },
    {
      message: "Tanggal selesai tidak boleh lebih awal dari tanggal mulai",
      path: ["tanggal_selesai"],
    }
  );

export type AjukanIzinFormValues = z.infer<typeof ajukanIzinSchema>;

export const approvalIzinSchema = z.object({
  catatan_approval: z
    .string()
    .trim()
    .max(500, "Catatan maksimal 500 karakter")
    .optional(),
});

export type ApprovalIzinFormValues = z.infer<typeof approvalIzinSchema>;
