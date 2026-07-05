"use client";

import { useState, useMemo, useEffect } from "react";
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
import { Check, ChevronsUpDown, AlertCircle, Layers, ArrowDown, BookOpen } from "lucide-react";
import { pemetaanJuz, SURAH_IDS } from "@/utils/daftarSurah";
import { surahNameToNumber, SURAH_PAGE_START } from "@/utils/mushafUtils";
import { type Santri } from "@/features/santri/types";
import { type SetoranFormFields, type SetoranPayload, type MushafSelection } from "../types";
import { MushafViewer } from "./MushafViewer";
import { sekolahService } from "@/features/sekolah/api/sekolahService";

// ─────────────────────────────────────────────
// Schema validasi
// ─────────────────────────────────────────────
const setoranSchema = z
  .object({
    id_santri: z.coerce.number().min(1, "Pilih santri"),
    id_sesi: z.coerce.number().min(1, "Pilih sesi halaqah"),
    juz: z.coerce.number().min(1).max(30),
    surat: z.string().min(1, "Pilih surah"),
    ayat_mulai: z.coerce.number().min(1),
    ayat_selesai: z.coerce.number().min(1),
    id_kategori: z.coerce.number().min(1, "Pilih kategori setoran"),
    taqwim: z.coerce.number().optional(),
    keterangan: z.string().optional(),
  })
  .refine((data) => data.ayat_selesai >= data.ayat_mulai, {
    message: "Ayat selesai tidak boleh kurang dari mulai",
    path: ["ayat_selesai"],
  });

import { type SesiHalaqah } from "@/types/domain/sesi-halaqah";

interface SetoranFormProps {
  santriList: Santri[];
  sesiList: SesiHalaqah[];
  onSubmit: (data: SetoranPayload) => Promise<{ success: boolean }>;
  onValidationChange?: (isValid: boolean) => void;
}

export function SetoranForm({
  santriList,
  sesiList,
  onSubmit,
  onValidationChange,
}: SetoranFormProps) {
  const [open, setOpen] = useState(false);

  // ── State Input Method & Mushaf ──
  const [inputMethod, setInputMethod] = useState<"manual" | "mushaf">("manual");
  const [mushafPage, setMushafPage] = useState<number>(1);
  const [mushafSelectionMode, setMushafSelectionMode] = useState<"start" | "end">("start");
  const [mushafSelection, setMushafSelection] = useState<MushafSelection | null>(null);

  // Fetch Kategori Data dinamis dari backend
  const { data: kategoriList = [] } = useQuery({
    queryKey: ["kategori-setoran"],
    queryFn: async () => {
      const res = await sekolahService.getKategori();
      return res.data || [];
    }
  });

  const form = useForm<SetoranFormFields>({
    resolver: zodResolver(setoranSchema) as Resolver<SetoranFormFields>,
    defaultValues: {
      id_santri: undefined,
      id_sesi: undefined,
      juz: 1,
      id_kategori: undefined,
      surat: "",
      ayat_mulai: undefined,
      ayat_selesai: undefined,
      taqwim: 0,
      keterangan: "",
    },
  });

  // Watcher untuk sinkronisasi
  // eslint-disable-next-line
  const selectedJuz = form.watch("juz");
  const selectedSurat = form.watch("surat");
  const availableSurah = pemetaanJuz[selectedJuz] || [];
  const currentSurahDetail = availableSurah.find(
    (s) => s.nama === selectedSurat,
  );

  const selectedSesiId = form.watch("id_sesi");
  const selectedSesiObj = sesiList.find((s) => s.id_sesi === selectedSesiId);

  const isTodayValidForSesi = useMemo(() => {
    if (
      !selectedSesiObj ||
      !selectedSesiObj.hari ||
      selectedSesiObj.hari.length === 0
    )
      return true;
    const jsDay = new Date().getDay();
    const mappedDay = jsDay === 0 ? 7 : jsDay;
    return selectedSesiObj.hari.includes(mappedDay);
  }, [selectedSesiObj]);

  useEffect(() => {
    if (onValidationChange) {
      if (inputMethod === "mushaf") {
        onValidationChange(false);
      } else {
        onValidationChange(isTodayValidForSesi);
      }
    }
  }, [inputMethod, isTodayValidForSesi, onValidationChange]);

  // Ketika user masuk ke mode mushaf, set halaman awal mushaf berdasarkan surah di form jika ada
  useEffect(() => {
    if (inputMethod === "mushaf") {
      const currentSurat = form.getValues("surat");
      if (currentSurat) {
        const surahNum = surahNameToNumber(currentSurat);
        if (surahNum) {
          const pageStart = SURAH_PAGE_START[surahNum] ?? 1;
          setMushafPage(pageStart);
        }
      }
    }
  }, [inputMethod]); // eslint-disable-line react-hooks/exhaustive-deps

  const onFormSubmit = async (values: SetoranFormFields) => {
    if (!isTodayValidForSesi) return;

    const suratId = SURAH_IDS[values.surat] || 1;

    const payload: SetoranPayload = {
      id_santri: values.id_santri,
      id_sesi: values.id_sesi,
      juz: values.juz,
      surat: values.surat,
      ayat: `${values.ayat_mulai}-${values.ayat_selesai}`,
      id_kategori: values.id_kategori,
      taqwim: values.taqwim || 0,
      keterangan: values.keterangan,
      start_surat_id: suratId,
      start_ayat: values.ayat_mulai,
      end_surat_id: suratId,
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
        surat: "",
        ayat_mulai: 1,
        ayat_selesai: 1,
      });
      setMushafSelection(null);
      setInputMethod("manual");
    }
  };

  return (
    <Form {...form}>
      <form
        id="setoran-form"
        onSubmit={form.handleSubmit(onFormSubmit)}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    {kategoriList.map((kat: any) => (
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
        </div>

        {/* Selector Input Method */}
        <div className="space-y-2 p-4 bg-muted/30 border border-muted/50 rounded-2xl">
          <label className="text-sm font-bold text-muted-foreground block">Metode Input Ayat</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setInputMethod("manual")}
              className={cn(
                "flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-bold transition-all duration-200",
                inputMethod === "manual"
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                  : "bg-card text-muted-foreground border-border hover:bg-muted/40 hover:text-foreground"
              )}
            >
              <Check className={cn("h-4 w-4 transition-transform", inputMethod === "manual" ? "scale-100" : "scale-0 w-0")} />
              Input Manual (Ketik)
            </button>
            <button
              type="button"
              onClick={() => setInputMethod("mushaf")}
              className={cn(
                "flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-bold transition-all duration-200",
                inputMethod === "mushaf"
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                  : "bg-card text-muted-foreground border-border hover:bg-muted/40 hover:text-foreground"
              )}
            >
              <BookOpen className="h-4 w-4" />
              Pilih dari Mushaf (Interaktif)
            </button>
          </div>
        </div>

        {inputMethod === "manual" ? (
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
                  <FormItem>
                    <FormLabel>Juz</FormLabel>
                    <Select
                      onValueChange={(v) => {
                        field.onChange(Number(v));
                        form.setValue("surat", "");
                        setMushafSelection(null);
                      }}
                      value={field.value.toString()}
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

              <FormField
                control={form.control}
                name="surat"
                render={({ field }) => (
                  <FormItem className="md:col-span-3">
                    <FormLabel>Surah</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
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
                              {availableSurah.map((surah) => (
                                <CommandItem
                                  key={surah.nama}
                                  value={surah.nama}
                                  onSelect={() => {
                                    form.setValue("surat", surah.nama);
                                    form.setValue("ayat_mulai", surah.ayatMulai);
                                    form.setValue(
                                      "ayat_selesai",
                                      surah.ayatMulai,
                                    );
                                    setOpen(false);
                                    form.trigger(["ayat_mulai", "ayat_selesai"]);
                                    setMushafSelection(null);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === surah.nama
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {surah.nama}
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
            </div>

            <div className="space-y-2">
              <div className="flex items-end gap-3 flex-wrap">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                  <FormField
                    control={form.control}
                    name="ayat_mulai"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ayat Mulai</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Mulai"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val === "" ? undefined : Number(val));
                              if (mushafSelection) setMushafSelection(null);
                            }}
                            onFocus={(e) =>
                              e.target.value === "0" && (e.target.value = "")
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ayat_selesai"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ayat Selesai</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Selesai"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              const numVal = val === "" ? undefined : Number(val);

                              if (
                                numVal &&
                                currentSurahDetail &&
                                numVal > currentSurahDetail.totalAyat
                              )
                                return;

                              field.onChange(numVal);
                              if (mushafSelection) setMushafSelection(null);
                            }}
                            onFocus={(e) =>
                              e.target.value === "0" && (e.target.value = "")
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="taqwim"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Taqwim</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
            </div>

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
          </>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-300">
            <div className="border rounded-2xl shadow-lg bg-card overflow-hidden h-[600px] flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40 shrink-0">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4.5 w-4.5 text-primary" />
                  <span className="text-sm font-bold">Mushaf Al-Quran</span>
                </div>
                <div className="text-xs text-muted-foreground bg-background px-3 py-1.5 rounded-full border">
                  {mushafSelection ? (
                    <span className="font-bold text-primary">
                      Terpilih: {mushafSelection.startSurahName} {mushafSelection.startAyah}-{mushafSelection.endAyah} ({mushafSelection.totalBaris} baris)
                    </span>
                  ) : (
                    "Pilih ayat awal & akhir pada Mushaf"
                  )}
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <MushafViewer
                  currentPage={mushafPage}
                  onPageChange={setMushafPage}
                  selection={mushafSelection}
                  onSelectionChange={setMushafSelection}
                  selectionMode={mushafSelectionMode}
                  onSelectionModeChange={setMushafSelectionMode}
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={() => {
                if (mushafSelection) {
                  form.setValue("surat", mushafSelection.startSurahName);
                  form.setValue("ayat_mulai", mushafSelection.startAyah);
                  form.setValue("ayat_selesai", mushafSelection.endAyah);
                  
                  const surahNum = surahNameToNumber(mushafSelection.startSurahName);
                  if (surahNum) {
                    for (const [juzNum, surahs] of Object.entries(pemetaanJuz)) {
                      const match = surahs.find(s => s.nama === mushafSelection.startSurahName);
                      if (match) {
                        form.setValue("juz", Number(juzNum));
                        break;
                      }
                    }
                  }
                  form.trigger(["juz", "surat", "ayat_mulai", "ayat_selesai"]);
                }
                setInputMethod("manual");
              }}
              className="w-full h-12 gap-2 text-base font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
            >
              <ArrowDown className="h-5 w-5 animate-bounce" />
              Terapkan Ayat & Kembali ke Formulir
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
