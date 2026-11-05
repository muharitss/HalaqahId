import { z } from "zod";
import { HubunganWali } from "../../../types/domain/santri-wali.ts";

export const santriWaliSchema = z.object({
  nama_wali: z
    .string()
    .trim()
    .min(1, "Nama wali wajib diisi")
    .max(100, "Nama wali maksimal 100 karakter"),
  hubungan: z.enum(
    [
      HubunganWali.AYAH,
      HubunganWali.IBU,
      HubunganWali.KAKEK,
      HubunganWali.NENEK,
      HubunganWali.PAMAN,
      HubunganWali.WALI,
      HubunganWali.LAINNYA,
    ],
    {
      error: "Hubungan wali tidak valid",
    }
  ),
  no_telepon: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val || val.length === 0) return true;
        const cleaned = val.replace(/\D/g, "");
        return cleaned.length >= 9 && cleaned.length <= 15;
      },
      {
        message: "Format nomor telepon tidak valid (minimal 9-15 digit)",
      }
    ),
  email: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val || val.length === 0) return true;
        return z.string().email().safeParse(val).success;
      },
      {
        message: "Format email tidak valid",
      }
    ),
  is_primary_contact: z.boolean().default(false),
});

export type SantriWaliFormData = z.infer<typeof santriWaliSchema>;
