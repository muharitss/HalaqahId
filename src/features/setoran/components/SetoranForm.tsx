"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, AlertCircle, Layers, BookOpen } from "lucide-react";
import { pemetaanJuz, SURAH_IDS } from "@/utils/daftarSurah";
import { surahNameToNumber, SURAH_PAGE_START, surahNumberToName } from "@/utils/mushafUtils";
import { type Santri } from "@/features/santri/types";
import { type SetoranFormFields, type SetoranPayload, type MushafSelection } from "../types";
import { sekolahService, type KategoriSetoranResponse } from "@/features/sekolah/api/sekolahService";
import { setoranService } from "../api/setoranService";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// ─────────────────────────────────────────────
// Schema validasi
// ─────────────────────────────────────────────
const getGlobalAyahId = (surahName: string, ayahNum: number): number => {
  const surahId = SURAH_IDS[surahName] || 0;
  return surahId * 10000 + ayahNum;
};

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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

const setoranSchema = z
  .object({
    id_santri: numericRequired("Pilih santri"),
    id_sesi: numericRequired("Pilih sesi halaqah"),
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

import { type SesiHalaqah } from "@/types/domain/sesi-halaqah";

interface SetoranFormProps {
  santriList: Santri[];
  sesiList: SesiHalaqah[];
  onSubmit: (data: SetoranPayload) => Promise<{ success: boolean }>;
  onValidationChange?: (isValid: boolean) => void;
}

const parseAyatRange = (ayatStr: string) => {
  if (!ayatStr) return { start: 1, end: 1 };
  const parts = ayatStr.split("-");
  const start = parseInt(parts[0]) || 1;
  const end = parseInt(parts[1]) || start;
  return { start, end };
};

const checkDuplicateSetoran = (
  history: any[],
  startSurahName: string,
  startAyat: number,
  endSurahName: string,
  endAyat: number,
  kategoriId: number
) => {
  const newStartId = getGlobalAyahId(startSurahName, startAyat);
  const newEndId = getGlobalAyahId(endSurahName, endAyat);

  return history.some((item) => {
    if (item.id_kategori !== kategoriId) return false;

    const startSurahId = item.start_surat_id || SURAH_IDS[item.surat] || 1;
    const endSurahId = item.end_surat_id || startSurahId;
    
    const itemStartAyat = item.start_ayat !== null && item.start_ayat !== undefined 
      ? item.start_ayat 
      : parseAyatRange(item.ayat).start;
    const itemEndAyat = item.end_ayat !== null && item.end_ayat !== undefined 
      ? item.end_ayat 
      : parseAyatRange(item.ayat).end;
      
    const itemStartId = startSurahId * 10000 + itemStartAyat;
    const itemEndId = endSurahId * 10000 + itemEndAyat;

    return newStartId <= itemEndId && itemStartId <= newEndId;
  });
};

const ALL_SURAHS = Array.from({ length: 114 }, (_, i) => {
  const num = i + 1;
  const name = surahNumberToName(num);
  return { number: num, name };
});

export function SetoranForm({
  santriList,
  sesiList,
  onSubmit,
  onValidationChange,
}: SetoranFormProps) {
  const [openMulai, setOpenMulai] = useState(false);
  const [openSelesai, setOpenSelesai] = useState(false);

  // ── State Mushaf ──
  const navigate = useNavigate();
  const location = useLocation();
  const [mushafSelection, setMushafSelection] = useState<MushafSelection | null>(null);

  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [pendingValues, setPendingValues] = useState<SetoranFormFields | null>(null);

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

    return setoranSchema.extend({
      custom_values: z.object(customFieldsSchema).optional(),
    });
  }, [customFields]);

  const form = useForm<SetoranFormFields>({
    resolver: zodResolver(dynamicSchema) as Resolver<SetoranFormFields>,
    defaultValues: {
      id_santri: undefined,
      id_sesi: undefined,
      juz: 1,
      id_kategori: undefined,
      surat_mulai: "",
      ayat_mulai: undefined,
      surat_selesai: "",
      ayat_selesai: undefined,
      tanggal_setoran: getTodayString(),
      taqwim: undefined,
      keterangan: "",
      custom_values: {},
    },
  });

  // Sinkronkan default values kustom ketika config sekolah berhasil di-load
  useEffect(() => {
    if (customFields.length > 0) {
      const currentValues = form.getValues("custom_values") || {};
      const newCustomValues = { ...currentValues };
      customFields.forEach((field) => {
        if (newCustomValues[field.id] === undefined) {
          newCustomValues[field.id] = field.defaultValue !== undefined ? field.defaultValue : (field.type === "boolean" ? false : "");
        }
      });
      form.setValue("custom_values", newCustomValues);
    }
  }, [customFields, form]);

  // Baca selection yang dikembalikan dari halaman mushaf via sessionStorage
  // Harus di-define SETELAH useForm agar 'form' sudah diinisialisasi
  const readMushafSelectionFromStorage = useCallback(() => {
    const stored = sessionStorage.getItem("mushaf_selection_pending");
    if (stored) {
      try {
        const { selection, juzNumber } = JSON.parse(stored);
        setTimeout(() => sessionStorage.removeItem("mushaf_selection_pending"), 0);
        if (selection) {
          setMushafSelection(selection);
          form.setValue("surat_mulai", selection.startSurahName);
          form.setValue("surat_selesai", selection.endSurahName);
          form.setValue("ayat_mulai", selection.startAyah);
          form.setValue("ayat_selesai", selection.endAyah);
          const calculatedJuz = juzNumber || findJuzBySurahAndAyah(selection.startSurahName, selection.startAyah);
          form.setValue("juz", calculatedJuz);
          form.trigger(["juz", "surat_mulai", "surat_selesai", "ayat_mulai", "ayat_selesai"]);
        }
      } catch {
        setTimeout(() => sessionStorage.removeItem("mushaf_selection_pending"), 0);
      }
    }
  }, [form]);

  // Jalankan setiap kali location berubah (setelah navigate(-1) dari mushaf)
  useEffect(() => {
    // 1. Pulihkan draf form (nama, kategori, tanggal, dll.) jika ada sebelum membaca mushaf
    const storedDraft = sessionStorage.getItem("setoran_form_draft");
    if (storedDraft) {
      try {
        const draft = JSON.parse(storedDraft);
        if (draft) {
          Object.entries(draft).forEach(([key, val]) => {
            if (val !== undefined && val !== null) {
              form.setValue(key as keyof SetoranFormFields, val as any);
            }
          });
          form.trigger(); // Trigger validasi untuk semua field yang dipulihkan
        }
      } catch (err) {
        console.error("Gagal memulihkan draf form:", err);
      }
      setTimeout(() => sessionStorage.removeItem("setoran_form_draft"), 0);
    }

    // 2. Baca seleksi ayat dari mushaf
    readMushafSelectionFromStorage();
  }, [location, readMushafSelectionFromStorage, form]);

  // Sinkronisasi Juz secara otomatis di UI ketika posisi surat/ayat berubah secara manual
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

  const selectedSantriId = form.watch("id_santri");
  const { data: studentHistory = [] } = useQuery({
    queryKey: ["setoran-history-local", selectedSantriId],
    queryFn: async () => {
      if (!selectedSantriId) return [];
      const res = await setoranService.getSetoranBySantri(selectedSantriId);
      return res.data || [];
    },
    enabled: !!selectedSantriId,
  });

  // Fetch Kategori Data dinamis dari backend
  const { data: kategoriList = [] } = useQuery({
    queryKey: ["kategori-setoran"],
    queryFn: async () => {
      const res = await sekolahService.getKategori();
      return res.data || [];
    }
  });
  const selectedSesiId = form.watch("id_sesi");
  const selectedSesiObj = sesiList.find((s) => s.id_sesi === selectedSesiId);

  const selectedTanggal = form.watch("tanggal_setoran");

  const isTodayValidForSesi = useMemo(() => {
    if (
      !selectedSesiObj ||
      !selectedSesiObj.hari ||
      selectedSesiObj.hari.length === 0
    )
      return true;

    const targetDate = selectedTanggal ? new Date(selectedTanggal) : new Date();
    const jsDay = targetDate.getDay();
    const mappedDay = jsDay === 0 ? 7 : jsDay;
    return selectedSesiObj.hari.includes(mappedDay);
  }, [selectedSesiObj, selectedTanggal]);

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isTodayValidForSesi);
    }
  }, [isTodayValidForSesi, onValidationChange]);

  // Fungsi untuk buka halaman mushaf
  const handleOpenMushaf = () => {
    // Simpan nilai form saat ini ke sessionStorage agar tidak hilang ketika kembali
    const currentValues = form.getValues();
    sessionStorage.setItem("setoran_form_draft", JSON.stringify(currentValues));

    const currentSurat = form.getValues("surat_mulai");
    const surahNum = currentSurat ? surahNameToNumber(currentSurat) : undefined;
    const initialPage = surahNum ? (SURAH_PAGE_START[surahNum] ?? 1) : 1;
    // Deteksi prefix route (muhafidz atau kepala-muhafidz) dari URL aktif
    const basePath = location.pathname.startsWith("/kepala-muhafidz")
      ? "/kepala-muhafidz"
      : "/muhafidz";
    navigate(`${basePath}/setoran/mushaf?page=${initialPage}`, {
      state: {
        initialSurahNumber: surahNum,
        currentSelection: mushafSelection,
      },
    });
  };

  const proceedSubmit = async (values: SetoranFormFields) => {
    const startSuratId = SURAH_IDS[values.surat_mulai] || 1;
    const endSuratId = SURAH_IDS[values.surat_selesai] || startSuratId;

    const calculatedJuz = findJuzBySurahAndAyah(values.surat_mulai, values.ayat_mulai);

    // Cari jika ada field kustom bernama 'taqwim' atau 'jumlah_salah'
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

    const payload: SetoranPayload = {
      id_santri: values.id_santri,
      id_sesi: values.id_sesi,
      juz: calculatedJuz,
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
      // Field mushaf (jika ada seleksi via mushaf)
      ...(mushafSelection && {
        start_page: mushafSelection.startPage,
        start_line: mushafSelection.startLine,
        end_page: mushafSelection.endPage,
        end_line: mushafSelection.endLine,
        total_baris: mushafSelection.totalBaris,
      }),
    };

    const result = await onSubmit(payload);
    if (result.success) {
      form.reset({
        ...form.getValues(),
        id_santri: undefined,
        surat_mulai: "",
        surat_selesai: "",
        ayat_mulai: 1,
        ayat_selesai: 1,
        tanggal_setoran: getTodayString(),
      });
      setMushafSelection(null);
    }
  };

  const onFormSubmit = async (values: SetoranFormFields) => {
    if (!isTodayValidForSesi) return;

    const selectedCategory = kategoriList.find(
      (k: KategoriSetoranResponse) => k.id_kategori === values.id_kategori
    );
    const hasOverlap =
      selectedCategory?.perlu_validasi_urutan &&
      checkDuplicateSetoran(
        studentHistory,
        values.surat_mulai,
        values.ayat_mulai,
        values.surat_selesai,
        values.ayat_selesai,
        values.id_kategori
      );

    if (hasOverlap) {
      setPendingValues(values);
      setShowDuplicateDialog(true);
      return;
    }

    await proceedSubmit(values);
  };

  return (
    <Form {...form}>
      <form
        id="setoran-form"
        onSubmit={form.handleSubmit(onFormSubmit)}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="id_santri"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Santri</FormLabel>
                <Select
                  onValueChange={(v) => field.onChange(Number(v))}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Santri" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {santriList.map((s) => (
                      <SelectItem
                        key={s.id_santri}
                        value={s.id_santri.toString()}
                      >
                        {s.nama_santri}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="id_sesi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sesi Halaqah</FormLabel>
                <Select
                  onValueChange={(v) => field.onChange(Number(v))}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Sesi" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sesiList.map((s) => (
                      <SelectItem key={s.id_sesi} value={s.id_sesi.toString()}>
                        {s.nama_sesi}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="id_kategori"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori</FormLabel>
                <Select 
                  onValueChange={(v) => field.onChange(Number(v))} 
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Kategori" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {kategoriList.map((kat: KategoriSetoranResponse) => (
                      <SelectItem 
                        key={kat.id_kategori} 
                        value={kat.id_kategori.toString()}
                      >
                        {kat.nama_kategori}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tanggal_setoran"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Setoran</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Tombol Pilih dari Mushaf */}
        <div className="flex items-center justify-between gap-3 p-3 bg-muted/30 border border-muted/50 rounded-2xl">
          <div className="flex-1 min-w-0">
            {mushafSelection ? (
              <div className="flex items-center gap-1.5 text-xs text-primary">
                <Layers className="h-3.5 w-3.5 shrink-0" />
                <span className="font-semibold">
                  {mushafSelection.startSurahName} {mushafSelection.startAyah} → {mushafSelection.endSurahName} {mushafSelection.endAyah}
                </span>
                <span className="text-muted-foreground">({mushafSelection.totalBaris} baris)</span>
                <button
                  type="button"
                  onClick={() => setMushafSelection(null)}
                  className="ml-1 text-destructive/70 hover:text-destructive underline text-xs"
                >
                  Hapus
                </button>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Pilih ayat langsung dari tampilan Mushaf Al-Quran interaktif</p>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenMushaf}
            className="gap-2 h-9 text-sm font-medium shrink-0"
          >
            <BookOpen className="h-4 w-4" />
            <span>Pilih dari Mushaf</span>
          </Button>
        </div>

        {(
          <>
            {!isTodayValidForSesi && (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-sm">
                    Sesi {selectedSesiObj?.nama_sesi} tidak dijadwalkan hari ini.
                  </p>
                  <p className="text-xs mt-1">
                    Setoran hanya dapat dicatat sesuai dengan jadwal hari sesi.
                    Silakan pilih sesi lain.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="juz"
                render={({ field }) => (
                  <FormItem className="md:col-span-4">
                    <FormLabel>Referi Juz Utama</FormLabel>
                    <Select
                      onValueChange={(v) => {
                        field.onChange(Number(v));
                        // Set surah awal secara default dari juz yang dipilih untuk membantu mempercepat input
                        const surahsInJuz = pemetaanJuz[Number(v)] || [];
                        if (surahsInJuz.length > 0) {
                          form.setValue("surat_mulai", surahsInJuz[0].nama);
                          form.setValue("surat_selesai", surahsInJuz[0].nama);
                          form.setValue("ayat_mulai", surahsInJuz[0].ayatMulai);
                          form.setValue("ayat_selesai", surahsInJuz[0].ayatMulai);
                        }
                        setMushafSelection(null);
                      }}
                      value={field.value?.toString() || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Juz" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 30 }, (_, i) => i + 1).map((juzNum) => (
                          <SelectItem key={juzNum} value={juzNum.toString()}>
                            Juz {juzNum}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Layout Grid Lintas Surah (Dari - Sampai) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* POSISI AWAL (DARI) */}
              <div className="border border-border rounded-2xl p-4 bg-muted/20 space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <h4 className="text-xs font-bold text-foreground/80 tracking-wider uppercase">Dari Posisi (Awal)</h4>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* Surah Mulai */}
                  <FormField
                    control={form.control}
                    name="surat_mulai"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Surah Awal</FormLabel>
                        <Popover open={openMulai} onOpenChange={setOpenMulai}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openMulai}
                                className="w-full justify-between font-normal text-left"
                              >
                                {field.value || "Pilih Surah..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0 popover-content-custom" align="start">
                            <Command>
                              <CommandInput placeholder="Cari Surah..." />
                              <CommandEmpty>Surah tidak ditemukan.</CommandEmpty>
                              <CommandGroup>
                                <CommandList>
                                  {ALL_SURAHS.map((surah) => (
                                    <CommandItem
                                      key={surah.number}
                                      value={surah.name}
                                      onSelect={() => {
                                        form.setValue("surat_mulai", surah.name);
                                        // Secara default ikut set surah_selesai agar mempercepat jika satu surah
                                        if (!form.getValues("surat_selesai")) {
                                          form.setValue("surat_selesai", surah.name);
                                        }
                                        setOpenMulai(false);
                                        setMushafSelection(null);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === surah.name ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {surah.name}
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Ayat Mulai */}
                  <FormField
                    control={form.control}
                    name="ayat_mulai"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ayat Awal</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Ayat"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val === "" ? undefined : Number(val));
                              if (mushafSelection) setMushafSelection(null);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* POSISI AKHIR (SAMPAI) */}
              <div className="border border-border rounded-2xl p-4 bg-muted/20 space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 animate-pulse" />
                  <h4 className="text-xs font-bold text-foreground/80 tracking-wider uppercase">Sampai Posisi (Akhir)</h4>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* Surah Selesai */}
                  <FormField
                    control={form.control}
                    name="surat_selesai"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Surah Akhir</FormLabel>
                        <Popover open={openSelesai} onOpenChange={setOpenSelesai}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openSelesai}
                                className="w-full justify-between font-normal text-left"
                              >
                                {field.value || "Pilih Surah..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0 popover-content-custom" align="start">
                            <Command>
                              <CommandInput placeholder="Cari Surah..." />
                              <CommandEmpty>Surah tidak ditemukan.</CommandEmpty>
                              <CommandGroup>
                                <CommandList>
                                  {ALL_SURAHS.map((surah) => (
                                    <CommandItem
                                      key={surah.number}
                                      value={surah.name}
                                      onSelect={() => {
                                        form.setValue("surat_selesai", surah.name);
                                        setOpenSelesai(false);
                                        setMushafSelection(null);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === surah.name ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {surah.name}
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Ayat Selesai */}
                  <FormField
                    control={form.control}
                    name="ayat_selesai"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ayat Akhir</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Ayat"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val === "" ? undefined : Number(val));
                              if (mushafSelection) setMushafSelection(null);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Custom Fields */}
            {customFields.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {customFields.map((field) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`custom_values.${field.id}` as any}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel>{field.label}</FormLabel>
                        <FormControl>
                          {(() => {
                            if (field.type === "text") {
                              return <Input placeholder={`Masukkan ${field.label}...`} {...formField} value={formField.value ?? ""} />;
                            }
                            if (field.type === "number") {
                              return (
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...formField}
                                  value={formField.value ?? ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    formField.onChange(val === "" ? "" : Number(val));
                                  }}
                                />
                              );
                            }
                            if (field.type === "select") {
                              return (
                                <Select
                                  onValueChange={formField.onChange}
                                  value={formField.value ?? ""}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Pilih..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {field.options?.map((opt: string) => (
                                      <SelectItem key={opt} value={opt}>
                                        {opt}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              );
                            }
                            if (field.type === "boolean") {
                              return (
                                <div className="flex items-center space-x-2 pt-2">
                                  <Checkbox
                                    id={field.id}
                                    checked={formField.value === true}
                                    onCheckedChange={formField.onChange}
                                  />
                                  <label htmlFor={field.id} className="text-xs font-normal text-muted-foreground cursor-pointer select-none">
                                    Ya / Tidak
                                  </label>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            )}

            {/* Keterangan */}
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="keterangan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keterangan</FormLabel>
                    <FormControl>
                      <Input placeholder="Catatan tambahan (opsional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {mushafSelection && (
              <div className="flex items-center gap-1.5 text-xs text-primary dark:text-primary bg-primary/10 border border-primary/20 px-2.5 py-1.5 rounded-lg w-fit animate-in fade-in zoom-in duration-200">
                <Layers className="h-3.5 w-3.5 shrink-0" />
                <span className="font-semibold text-primary/90 dark:text-primary">
                  Terisi otomatis dari Mushaf: {mushafSelection.totalBaris} baris
                </span>
                <span className="text-emerald-500">·</span>
                <span>
                  Hal. {mushafSelection.startPage}
                  {mushafSelection.startPage !== mushafSelection.endPage &&
                    `–${mushafSelection.endPage}`}
                </span>
              </div>
            )}
          </>
        )}
      </form>

      <AlertDialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              Peringatan Setoran Duplikat
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground">
              Ayat ini sudah disetorkan sebelumnya. Apakah Anda ingin tetap menyetorkannya kembali, mengganti kategori, atau membatalkannya?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <AlertDialogCancel
              onClick={() => {
                setShowDuplicateDialog(false);
                setPendingValues(null);
              }}
              className="w-full sm:w-auto"
            >
              Batal
            </AlertDialogCancel>
            <Button
              variant="outline"
              onClick={() => {
                setShowDuplicateDialog(false);
                setPendingValues(null);
              }}
              className="w-full sm:w-auto border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              Ganti Kategori
            </Button>
            <AlertDialogAction
              onClick={() => {
                if (pendingValues) {
                  proceedSubmit(pendingValues);
                }
                setShowDuplicateDialog(false);
                setPendingValues(null);
              }}
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white"
            >
              Tetap Input
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Form>
  );
}
