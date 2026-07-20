
import * as z from "zod";

// ─────────────────────────────────────────────
// Constants (akan dipindah ke constants nanti)
// ─────────────────────────────────────────────
import { pemetaanJuz } from "@/utils/daftarSurah";

const getSurahTotalAyat = (surahName: string): number => {
  for (const surahs of Object.values(pemetaanJuz)) {
    const match = surahs.find(
      (s) => s.nama.toLowerCase() === surahName.toLowerCase()
    );
    if (match) return match.totalAyat;
  }
  return 286;
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const numericRequired = (msg: string) =>
  z.preprocess((val) => {
    if (val === "" || val === undefined || val === null) return undefined;
    const n = Number(val);
    return isNaN(n) ? undefined : n;
  }, z.number({ message: msg }).min(1, msg));

const numericOptional = () =>
  z.preprocess((val) => {
    if (val === "" || val === undefined || val === null) return undefined;
    const n = Number(val);
    return isNaN(n) ? undefined : n;
  }, z.number().optional());

// ─────────────────────────────────────────────
// Base Schema (tanpa custom_fields)
// ─────────────────────────────────────────────
export const setoranBaseSchema = z
  .object({
    id_santri: numericRequired("Pilih santri"),
    id_sesi: numericOptional(),
    juz: z.preprocess((val) => {
      if (val === "" || val === undefined || val === null) return undefined;
      const n = Number(val);
      return isNaN(n) ? undefined : n;
    }, z.number({ message: "Pilih juz" }).min(1).max(30)),
    surat_mulai: z.string().min(1, "Pilih surah mulai"),
    ayat_mulai: numericRequired("Ayat mulai minimal 1"),
    surat_selesai: z.string().min(1, "Pilih surah selesai"),
    ayat_selesai: numericRequired("Ayat selesai minimal 1"),
    id_kategori: numericRequired("Pilih kategori setoran"),
    tanggal_setoran: z.string().min(1, "Pilih tanggal setoran"),
    taqwim: numericOptional(),
    keterangan: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.surat_mulai || !data.ayat_mulai) return true;
      const maxAyatMulai = getSurahTotalAyat(data.surat_mulai);
      return data.ayat_mulai <= maxAyatMulai;
    },
    {
      message: "Ayat mulai melebihi total ayat surah tersebut",
      path: ["ayat_mulai"],
    }
  )
  .refine(
    (data) => {
      if (!data.surat_selesai || !data.ayat_selesai) return true;
      const maxAyatSelesai = getSurahTotalAyat(data.surat_selesai);
      return data.ayat_selesai <= maxAyatSelesai;
    },
    {
      message: "Ayat selesai melebihi total ayat surah tersebut",
      path: ["ayat_selesai"],
    }
  );

export type SetoranFormFields = z.infer<typeof setoranBaseSchema>;

// ─────────────────────────────────────────────
// Dynamic Schema Builder
// ─────────────────────────────────────────────
export function buildDynamicSchema(
  customFields: Array<{
    id: string;
    type: string;
    label: string;
    required?: boolean;
    options?: string[];
  }>
) {
  const customFieldsSchema: Record<string, z.ZodTypeAny> = {};

  customFields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny = z.any();

    if (field.type === "text") {
      fieldSchema = z.string();
      if (field.required) {
        fieldSchema = (fieldSchema as z.ZodString).min(
          1,
          `Field "${field.label}" wajib diisi`
        );
      } else {
        fieldSchema = fieldSchema.optional().nullable();
      }
    } else if (field.type === "number") {
      fieldSchema = z.preprocess((val) => {
        if (val === "" || val === undefined || val === null) return undefined;
        const n = Number(val);
        return isNaN(n) ? undefined : n;
      }, field.required
        ? z.number({ message: `Field "${field.label}" wajib diisi angka` })
        : z.number().optional().nullable()
      );
    } else if (field.type === "select") {
      fieldSchema = z.string();
      if (field.required) {
        fieldSchema = (fieldSchema as z.ZodString).min(
          1,
          `Field "${field.label}" wajib dipilih`
        );
      } else {
        fieldSchema = fieldSchema.optional().nullable();
      }
    } else if (field.type === "boolean") {
      fieldSchema = z.boolean();
      if (field.required) {
        fieldSchema = fieldSchema.refine((val) => val === true, {
          message: `Field "${field.label}" wajib dicentang`,
        });
      } else {
        fieldSchema = fieldSchema.optional().nullable();
      }
    }

    customFieldsSchema[field.id] = fieldSchema;
  });

  return setoranBaseSchema.extend({
    custom_values: z.object(customFieldsSchema).optional(),
  });
}