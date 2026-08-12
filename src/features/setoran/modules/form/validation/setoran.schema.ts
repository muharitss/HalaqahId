
import * as z from "zod";
import { getSurahTotalAyat, getSurahNumberByName } from "@/utils/daftarSurah";

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
    id_santri: numericRequired("Santri wajib dipilih"),
    id_sesi: numericOptional(),
    juz: z.preprocess((val) => {
      if (val === "" || val === undefined || val === null) return undefined;
      const n = Number(val);
      return isNaN(n) ? undefined : n;
    }, z.number({ message: "Juz wajib dipilih" }).min(1, "Juz minimal 1").max(30, "Juz maksimal 30")),
    surat_mulai: z.string().min(1, "Surah awal wajib dipilih"),
    ayat_mulai: numericRequired("Ayat awal minimal 1"),
    surat_selesai: z.string().min(1, "Surah akhir wajib dipilih"),
    ayat_selesai: numericRequired("Ayat akhir minimal 1"),
    id_kategori: numericRequired("Kategori setoran wajib dipilih"),
    tanggal_setoran: z.string().min(1, "Tanggal setoran wajib dipilih"),
    taqwim: numericOptional(),
    keterangan: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Validasi batas maksimal ayat awal
    if (data.surat_mulai && typeof data.ayat_mulai === "number") {
      const maxAyatMulai = getSurahTotalAyat(data.surat_mulai);
      if (data.ayat_mulai > maxAyatMulai) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Ayat awal (${data.ayat_mulai}) melebihi total ayat Surah ${data.surat_mulai} (maksimal ${maxAyatMulai} ayat)`,
          path: ["ayat_mulai"],
        });
      }
    }

    // Validasi batas maksimal ayat akhir
    if (data.surat_selesai && typeof data.ayat_selesai === "number") {
      const maxAyatSelesai = getSurahTotalAyat(data.surat_selesai);
      if (data.ayat_selesai > maxAyatSelesai) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Ayat akhir (${data.ayat_selesai}) melebihi total ayat Surah ${data.surat_selesai} (maksimal ${maxAyatSelesai} ayat)`,
          path: ["ayat_selesai"],
        });
      }
    }

    // Validasi urutan surah dan rentang ayat
    if (data.surat_mulai && data.surat_selesai) {
      const startSurahNum = getSurahNumberByName(data.surat_mulai);
      const endSurahNum = getSurahNumberByName(data.surat_selesai);

      if (startSurahNum !== null && endSurahNum !== null) {
        if (endSurahNum < startSurahNum) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Surah akhir (${data.surat_selesai}) tidak boleh mendahului surah awal (${data.surat_mulai}) dalam urutan mushaf`,
            path: ["surat_selesai"],
          });
        } else if (
          startSurahNum === endSurahNum &&
          typeof data.ayat_mulai === "number" &&
          typeof data.ayat_selesai === "number"
        ) {
          if (data.ayat_selesai < data.ayat_mulai) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Ayat akhir (${data.ayat_selesai}) tidak boleh lebih kecil dari ayat awal (${data.ayat_mulai}) pada surah yang sama`,
              path: ["ayat_selesai"],
            });
          }
        }
      }
    }
  });

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