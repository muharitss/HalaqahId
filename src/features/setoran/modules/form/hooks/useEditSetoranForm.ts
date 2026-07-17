"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { SURAH_IDS, pemetaanJuz } from "@/utils/daftarSurah";
import { type SetoranRecord, type SetoranPayload } from "../../../types";
import { sekolahService } from "@/features/sekolah";

// Helper function to extract Surah Name and Ayah from strings
const parseAyatRange = (ayatStr: string) => {
  if (!ayatStr) return { start: 1, end: 1 };
  const parts = ayatStr.split("-");
  const start = parseInt(parts[0]) || 1;
  const end = parseInt(parts[1]) || start;
  return { start, end };
};

const parseSurahRange = (surahStr: string) => {
  if (!surahStr) return { start: "", end: "" };
  const parts = surahStr.split(" - ");
  const start = parts[0] || "";
  const end = parts[1] || start;
  return { start, end };
};

const getGlobalAyahId = (surahName: string, ayahNum: number): number => {
  const surahId = SURAH_IDS[surahName] || 0;
  return surahId * 10000 + ayahNum;
};

const getSurahTotalAyat = (surahName: string): number => {
  for (const surahs of Object.values(pemetaanJuz)) {
    const match = surahs.find((s) => s.nama.toLowerCase() === surahName.toLowerCase());
    if (match) return match.totalAyat;
  }
  return 286;
};

const findJuzBySurahAndAyah = (surahName: string, ayahNum: number): number => {
  for (const [juzNumStr, surahs] of Object.entries(pemetaanJuz)) {
    const juzNum = Number(juzNumStr);
    const match = surahs.find(
      (s) =>
        s.nama.toLowerCase() === surahName.toLowerCase() &&
        ayahNum >= s.ayatMulai &&
        ayahNum <= s.ayatSelesai
    );
    if (match) return juzNum;
  }
  return 1;
};

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

const editSchema = z
  .object({
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
      if (!data.surat_mulai || !data.ayat_mulai || !data.surat_selesai || !data.ayat_selesai) return true;
      const startId = getGlobalAyahId(data.surat_mulai, data.ayat_mulai);
      const endId = getGlobalAyahId(data.surat_selesai, data.ayat_selesai);
      return endId >= startId;
    },
    {
      message: "Posisi akhir tidak boleh sebelum posisi awal setoran",
      path: ["surat_selesai"],
    }
  )
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

export type EditFormFields = z.infer<typeof editSchema> & {
  custom_values?: Record<string, any>;
};

interface UseEditSetoranFormProps {
  isOpen: boolean;
  onClose: () => void;
  setoran: SetoranRecord | null;
  onSubmit: (id: number, payload: Partial<SetoranPayload>) => Promise<{ success: boolean }>;
}

export function useEditSetoranForm({
  isOpen,
  onClose,
  setoran,
  onSubmit,
}: UseEditSetoranFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Kategori Data
  const { data: kategoriList = [] } = useQuery({
    queryKey: ["kategori-setoran-edit"],
    queryFn: async () => {
      const res = await sekolahService.getKategori();
      return res.data || [];
    },
  });

  // Load konfigurasi form dinamis sekolah
  const { data: profileData } = useQuery({
    queryKey: ["schoolProfile"],
    queryFn: () => sekolahService.getProfile(),
  });

  const customFields = useMemo(() => {
    return (profileData?.data?.form_setoran_config as any[]) || [];
  }, [profileData]);

  // Build schema dinamis menggabungkan field core + kustom
  const dynamicSchema = useMemo(() => {
    const customFieldsSchema: Record<string, z.ZodTypeAny> = {};
    customFields.forEach((field) => {
      let fieldSchema: z.ZodTypeAny = z.any();
      if (field.type === "text") {
        fieldSchema = z.string();
        if (field.required) {
          fieldSchema = (fieldSchema as z.ZodString).min(1, `Field "${field.label}" wajib diisi`);
        } else {
          fieldSchema = fieldSchema.optional().nullable();
        }
      } else if (field.type === "number") {
        fieldSchema = z.preprocess((val) => {
          if (val === "" || val === undefined || val === null) return undefined;
          const n = Number(val);
          return isNaN(n) ? undefined : n;
        }, field.required ? z.number({ message: `Field "${field.label}" wajib diisi angka` }) : z.number().optional().nullable());
      } else if (field.type === "select") {
        fieldSchema = z.string();
        if (field.required) {
          fieldSchema = (fieldSchema as z.ZodString).min(1, `Field "${field.label}" wajib dipilih`);
        } else {
          fieldSchema = fieldSchema.optional().nullable();
        }
      } else if (field.type === "boolean") {
        fieldSchema = z.boolean();
        if (field.required) {
          fieldSchema = fieldSchema.refine(val => val === true, { message: `Field "${field.label}" wajib dicentang` });
        } else {
          fieldSchema = fieldSchema.optional().nullable();
        }
      }
      customFieldsSchema[field.id] = fieldSchema;
    });

    return editSchema.extend({
      custom_values: z.object(customFieldsSchema).optional(),
    });
  }, [customFields]);

  const form = useForm<EditFormFields>({
    resolver: zodResolver(dynamicSchema) as any,
    defaultValues: {
      juz: 1,
      surat_mulai: "",
      ayat_mulai: 1,
      surat_selesai: "",
      ayat_selesai: 1,
      id_kategori: undefined,
      tanggal_setoran: "",
      taqwim: undefined,
      keterangan: "",
      custom_values: {},
    },
  });

  // Reset form dengan nilai setoran ketika modal dibuka
  useEffect(() => {
    if (isOpen && setoran) {
      const parsedSurah = parseSurahRange(setoran.surat);
      const parsedAyat = parseAyatRange(setoran.ayat);
      
      const rawDate = setoran.tanggal_setoran ? new Date(setoran.tanggal_setoran) : new Date();
      const year = rawDate.getFullYear();
      const month = String(rawDate.getMonth() + 1).padStart(2, "0");
      const day = String(rawDate.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;

      const initialCustomValues: Record<string, any> = {};
      customFields.forEach((field) => {
        const savedVal = (setoran as any).custom_values?.[field.id];
        initialCustomValues[field.id] = savedVal !== undefined ? savedVal : (field.defaultValue !== undefined ? field.defaultValue : (field.type === "boolean" ? false : ""));
      });

      form.reset({
        juz: setoran.juz,
        surat_mulai: parsedSurah.start,
        ayat_mulai: parsedAyat.start,
        surat_selesai: parsedSurah.end,
        ayat_selesai: parsedAyat.end,
        id_kategori: setoran.id_kategori,
        tanggal_setoran: dateString,
        taqwim: setoran.taqwim ?? undefined,
        keterangan: setoran.keterangan || "",
        custom_values: initialCustomValues,
      });
    }
  }, [isOpen, setoran, form, customFields]);

  // Sync Juz otomatis saat surat_mulai/ayat_mulai berubah
  const watchSuratMulai = form.watch("surat_mulai");
  const watchAyatMulai = form.watch("ayat_mulai");
  useEffect(() => {
    if (watchSuratMulai && typeof watchAyatMulai === "number" && watchAyatMulai > 0) {
      const calculatedJuz = findJuzBySurahAndAyah(watchSuratMulai, watchAyatMulai);
      if (calculatedJuz !== form.getValues("juz")) {
        form.setValue("juz", calculatedJuz);
      }
    }
  }, [watchSuratMulai, watchAyatMulai, form]);

  const onFormSubmit = async (values: EditFormFields) => {
    if (!setoran) return;
    setIsSubmitting(true);
    try {
      const startSuratId = SURAH_IDS[values.surat_mulai] || 1;
      const endSuratId = SURAH_IDS[values.surat_selesai] || startSuratId;

      let taqwimValue: number | undefined = undefined;
      if (values.custom_values) {
        const customTaqwimKey = Object.keys(values.custom_values).find(
          (key) => key.toLowerCase() === "taqwim" || key.toLowerCase() === "jumlah_salah"
        );
        if (customTaqwimKey) {
          const val = values.custom_values[customTaqwimKey];
          if (val !== undefined && val !== null && val !== "") {
            taqwimValue = Number(val);
          }
        }
      }

      const payload: Partial<SetoranPayload> = {
        juz: values.juz,
        surat: values.surat_mulai === values.surat_selesai
          ? values.surat_mulai
          : `${values.surat_mulai} - ${values.surat_selesai}`,
        ayat: `${values.ayat_mulai}-${values.ayat_selesai}`,
        id_kategori: values.id_kategori,
        tanggal_setoran: values.tanggal_setoran,
        taqwim: taqwimValue,
        keterangan: values.keterangan,
        custom_values: values.custom_values || null,
        start_surat_id: startSuratId,
        start_ayat: values.ayat_mulai,
        end_surat_id: endSuratId,
        end_ayat: values.ayat_selesai,
      };

      const res = await onSubmit(setoran.id_setoran, payload);
      if (res.success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    kategoriList,
    customFields,
    isSubmitting,
    onFormSubmit,
  };
}
