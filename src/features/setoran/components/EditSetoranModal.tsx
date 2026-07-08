"use client";

import { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { pemetaanJuz, SURAH_IDS } from "@/utils/daftarSurah";
import { surahNumberToName } from "@/utils/mushafUtils";
import { type SetoranRecord, type SetoranPayload } from "../types";
import { sekolahService, type KategoriSetoranResponse } from "@/features/sekolah/api/sekolahService";

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

type EditFormFields = z.infer<typeof editSchema>;

interface EditSetoranModalProps {
  isOpen: boolean;
  onClose: () => void;
  setoran: SetoranRecord | null;
  onSubmit: (id: number, payload: Partial<SetoranPayload>) => Promise<{ success: boolean }>;
}

const ALL_SURAHS = Array.from({ length: 114 }, (_, i) => {
  const num = i + 1;
  const name = surahNumberToName(num);
  return { number: num, name };
});

export function EditSetoranModal({
  isOpen,
  onClose,
  setoran,
  onSubmit,
}: EditSetoranModalProps) {
  const [openMulai, setOpenMulai] = useState(false);
  const [openSelesai, setOpenSelesai] = useState(false);
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
    resolver: zodResolver(dynamicSchema) as Resolver<EditFormFields>,
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

  // Reset form with setoran values ketika modal dibuka
  useEffect(() => {
    if (isOpen && setoran) {
      const parsedSurah = parseSurahRange(setoran.surat);
      const parsedAyat = parseAyatRange(setoran.ayat);
      
      // Parse tanggal_setoran to local format YYYY-MM-DD
      const rawDate = setoran.tanggal_setoran ? new Date(setoran.tanggal_setoran) : new Date();
      const year = rawDate.getFullYear();
      const month = String(rawDate.getMonth() + 1).padStart(2, "0");
      const day = String(rawDate.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;

      // Ambil custom values yang sudah disimpan atau set default jika kosong
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

  // Sync Juz automatically when surat_mulai/ayat_mulai changes
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Setoran Hafalan</DialogTitle>
          <DialogDescription>
            Ubah rincian setoran hafalan santri {setoran?.santri?.nama_santri}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="id_kategori"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select
                      onValueChange={(v) => field.onChange(Number(v))}
                      value={field.value?.toString() || ""}
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

              <FormField
                control={form.control}
                name="juz"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referi Juz</FormLabel>
                    <Select
                      onValueChange={(v) => {
                        field.onChange(Number(v));
                        const surahsInJuz = pemetaanJuz[Number(v)] || [];
                        if (surahsInJuz.length > 0) {
                          form.setValue("surat_mulai", surahsInJuz[0].nama);
                          form.setValue("surat_selesai", surahsInJuz[0].nama);
                          form.setValue("ayat_mulai", surahsInJuz[0].ayatMulai);
                          form.setValue("ayat_selesai", surahsInJuz[0].ayatMulai);
                        }
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* POSISI AWAL */}
              <div className="border border-border rounded-xl p-3 bg-muted/10 space-y-3">
                <span className="text-xs font-bold text-muted-foreground uppercase">Dari Posisi</span>
                <div className="grid grid-cols-3 gap-2">
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
                                className="w-full justify-between font-normal text-left text-xs h-9 px-2"
                              >
                                {field.value || "Pilih Surah"}
                                <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Cari..." className="h-8" />
                              <CommandEmpty>Tidak ada</CommandEmpty>
                              <CommandGroup className="max-h-[200px] overflow-y-auto">
                                <CommandList>
                                  {ALL_SURAHS.map((surah) => (
                                    <CommandItem
                                      key={surah.number}
                                      value={surah.name}
                                      onSelect={() => {
                                        form.setValue("surat_mulai", surah.name);
                                        if (!form.getValues("surat_selesai")) {
                                          form.setValue("surat_selesai", surah.name);
                                        }
                                        setOpenMulai(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-3 w-3",
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

                  <FormField
                    control={form.control}
                    name="ayat_mulai"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ayat Awal</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="h-9"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* POSISI AKHIR */}
              <div className="border border-border rounded-xl p-3 bg-muted/10 space-y-3">
                <span className="text-xs font-bold text-muted-foreground uppercase">Sampai Posisi</span>
                <div className="grid grid-cols-3 gap-2">
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
                                className="w-full justify-between font-normal text-left text-xs h-9 px-2"
                              >
                                {field.value || "Pilih Surah"}
                                <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Cari..." className="h-8" />
                              <CommandEmpty>Tidak ada</CommandEmpty>
                              <CommandGroup className="max-h-[200px] overflow-y-auto">
                                <CommandList>
                                  {ALL_SURAHS.map((surah) => (
                                    <CommandItem
                                      key={surah.number}
                                      value={surah.name}
                                      onSelect={() => {
                                        form.setValue("surat_selesai", surah.name);
                                        setOpenSelesai(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-3 w-3",
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

                  <FormField
                    control={form.control}
                    name="ayat_selesai"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ayat Akhir</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="h-9"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
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
                          {field.type === "text" && (
                            <Input placeholder={`Masukkan ${field.label}...`} {...formField} value={formField.value ?? ""} />
                          )}
                          {field.type === "number" && (
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
                          )}
                          {field.type === "select" && (
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
                          )}
                          {field.type === "boolean" && (
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
                          )}
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

            <DialogFooter className="mt-6 gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
