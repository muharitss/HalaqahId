import { z } from "zod";

export const pengumumanFormSchema = z.object({
  judul: z
    .string()
    .min(3, "Judul pengumuman minimal 3 karakter")
    .max(255, "Judul maksimal 255 karakter"),
  isi: z
    .string()
    .min(5, "Isi pengumuman minimal 5 karakter"),
  prioritas: z.enum(["NORMAL", "PENTING", "URGENT"]),
  is_pinned: z.boolean(),
  tanggal_mulai: z.string().optional().nullable(),
  tanggal_selesai: z.string().optional().nullable(),
  target_type: z.enum(["ALL", "HALAQAH", "LEVEL", "SANTRI", "ROLE", "USER"]),
  target_id: z.number().optional().nullable(),
});

export type PengumumanFormValues = z.infer<typeof pengumumanFormSchema>;

export const defaultPengumumanFormValues: PengumumanFormValues = {
  judul: "",
  isi: "",
  prioritas: "NORMAL",
  is_pinned: false,
  tanggal_mulai: null,
  tanggal_selesai: null,
  target_type: "ALL",
  target_id: null,
};
