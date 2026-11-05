import * as z from "zod";

export const kriteriaItemSchema = z.object({
  id_kriteria: z.number().optional(),
  nama: z.string().trim().min(1, "Nama kriteria wajib diisi"),
  bobot: z.coerce.number().min(1, "Bobot minimal 1%").max(100, "Bobot maksimal 100%"),
  skala_min: z.coerce.number().min(0, "Skala min minimal 0").default(1),
  skala_max: z.coerce.number().min(1, "Skala max minimal 1").default(4),
  urutan: z.number().optional(),
}).refine((data) => data.skala_max > data.skala_min, {
  message: "Skala maksimal harus lebih besar dari skala minimal",
  path: ["skala_max"],
});

export const rubrikFormSchema = z.object({
  nama: z.string().trim().min(2, "Nama rubrik minimal 2 karakter"),
  tipe: z.enum(["SETORAN", "UJIAN"]).default("SETORAN"),
  is_default: z.boolean().default(false),
  kriteria: z.array(kriteriaItemSchema).min(1, "Minimal harus ada 1 kriteria penilaian"),
}).superRefine((data, ctx) => {
  const totalBobot = data.kriteria.reduce((sum, k) => sum + (Number(k.bobot) || 0), 0);
  if (totalBobot !== 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Total bobot seluruh kriteria harus 100% (saat ini: ${totalBobot}%)`,
      path: ["kriteria"],
    });
  }
});

export type KriteriaItemFormValues = z.infer<typeof kriteriaItemSchema>;
export type RubrikFormValues = z.infer<typeof rubrikFormSchema>;
