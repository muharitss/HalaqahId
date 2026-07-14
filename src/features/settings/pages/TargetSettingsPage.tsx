import { useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Target, ChevronLeft, Loader2, CalendarDays, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

import { sekolahService, type KategoriSetoranResponse } from "@/features/sekolah/api/sekolahService";
import {
  useTargetList,
  useCreateTarget,
  useUpdateTarget,
  useDeleteTarget,
} from "../hooks/useTarget";
import { targetSchema, type TargetFormValues } from "@/utils/zodSchema";
import type { TargetSekolah } from "@/types/domain/target";
import {
  TIPE_TARGET_LABELS,
  SATUAN_TARGET_LABELS,
  HARI_LABELS_SHORT,
  parseHariAktif,
  formatHariAktif,
} from "@/types/domain/target";

// ---------------------------------------------------------------------------
// Konstanta
// ---------------------------------------------------------------------------

const TIPE_OPTIONS = [
  { value: "HARIAN", label: "Harian", desc: "Target per sesi setoran, dengan pilihan hari aktif" },
  { value: "MINGGUAN", label: "Mingguan", desc: "Dievaluasi per minggu (Senin–Minggu)" },
  { value: "BULANAN", label: "Bulanan", desc: "Dievaluasi per bulan" },
  { value: "SEMESTER", label: "Semester", desc: "Dievaluasi per semester (Jan–Jun / Jul–Des)" },
  { value: "GLOBAL", label: "Semua Waktu", desc: "Tidak terikat periode tertentu" },
] as const;

const SATUAN_OPTIONS = [
  { value: "HALAMAN", label: "Halaman", hint: "Standar mushaf 15 baris/halaman" },
  { value: "BARIS", label: "Baris", hint: "Jumlah baris mushaf (1 hal = 15 baris)" },
  { value: "AYAT", label: "Ayat", hint: "Jumlah ayat Al-Quran" },
  { value: "JUZ", label: "Juz", hint: "1 Juz ≈ 20 halaman / 304 ayat" },
] as const;

const ARAH_OPTIONS = [
  { value: "BEBAS", label: "Bebas", desc: "Santri dapat menyetor bagian mana saja secara acak" },
  { value: "MAJU", label: "Maju", desc: "Santri harus menyetor berurutan maju (surah awal ke surah akhir)" },
  { value: "MUNDUR", label: "Mundur", desc: "Santri harus menyetor berurutan mundur (surah akhir ke surah awal)" },
] as const;

const STATUS_COLORS: Record<string, string> = {
  HARIAN: "bg-blue-100 text-blue-700 dark:bg-blue-900/30",
  MINGGUAN: "bg-violet-100 text-violet-700 dark:bg-violet-900/30",
  BULANAN: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30",
  SEMESTER: "bg-amber-100 text-amber-700 dark:bg-amber-900/30",
  GLOBAL: "bg-slate-100 text-slate-700 dark:bg-slate-800",
};

/**
 * Daftar hari yang ditampilkan di form target.
 * Urutan: Senin–Ahad (konsisten dengan SesiModal).
 * Nilai: 1=Senin, ..., 6=Sabtu, 0=Ahad (sesuai target DB).
 */
const HARI_OPTIONS = [
  { value: 1, label: "Senin" },
  { value: 2, label: "Selasa" },
  { value: 3, label: "Rabu" },
  { value: 4, label: "Kamis" },
  { value: 5, label: "Jumat" },
  { value: 6, label: "Sabtu" },
  { value: 0, label: "Ahad" },
] as const;

/** Preset hari yang umum digunakan di sekolah */
const PRESET_HARI = [
  { label: "Senin–Jumat", days: [1, 2, 3, 4, 5], desc: "5 hari" },
  { label: "Senin–Sabtu", days: [1, 2, 3, 4, 5, 6], desc: "6 hari" },
] as const;

// ---------------------------------------------------------------------------
// Sub-komponen: HariAktifPicker
// ---------------------------------------------------------------------------

interface HariAktifPickerProps {
  value: number[] | null | undefined;
  onChange: (val: number[]) => void;
}

function HariAktifPicker({ value, onChange }: HariAktifPickerProps) {
  const selected = value ?? [];

  const handleCheckedChange = (day: number, checked: boolean) => {
    if (checked) {
      onChange([...selected, day].sort());
    } else {
      onChange(selected.filter((d) => d !== day));
    }
  };

  const applyPreset = (days: readonly number[]) => {
    onChange([...days].sort());
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Hari Setoran Aktif <span className="text-red-500">*</span></label>
        <div className="flex gap-1.5">
          {PRESET_HARI.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset.days)}
              className="text-[11px] px-2 py-0.5 rounded border border-dashed border-primary/40 text-primary hover:bg-primary/5 transition-colors"
            >
              {preset.label} ({preset.desc})
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border rounded-md p-3">
        {HARI_OPTIONS.map((h) => (
          <div key={h.value} className="flex items-center space-x-2">
            <Checkbox
              id={`hari-${h.value}`}
              checked={selected.includes(h.value)}
              onCheckedChange={(checked) => handleCheckedChange(h.value, !!checked)}
            />
            <label
              htmlFor={`hari-${h.value}`}
              className="font-normal cursor-pointer text-sm select-none"
            >
              {h.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Komponen utama
// ---------------------------------------------------------------------------

export default function TargetSettingsPage() {
  const navigate = useNavigate();
  const { data: targets = [], isLoading } = useTargetList();
  const createMutation = useCreateTarget();
  const updateMutation = useUpdateTarget();
  const deleteMutation = useDeleteTarget();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<TargetSekolah | null>(null);
  const [deletingTarget, setDeletingTarget] = useState<TargetSekolah | null>(null);

  // Fetch Kategori Data
  const { data: kategoriList = [], isLoading: isLoadingKategori } = useQuery<KategoriSetoranResponse[]>({
    queryKey: ["kategori-setoran"],
    queryFn: async () => {
      const res = await sekolahService.getKategori();
      return (res.data || []) as KategoriSetoranResponse[];
    }
  });

  const form = useForm<TargetFormValues>({
    resolver: zodResolver(targetSchema) as Resolver<TargetFormValues>,
    defaultValues: {
      nama_target: "",
      id_kategori: undefined,
      tipe: "HARIAN",
      nilai_target: 1,
      satuan: "HALAMAN",
      deskripsi: "",
      hari_aktif: [1, 2, 3, 4, 5], // default: Senin–Jumat
      start_juz: null as any,
      end_juz: null as any,
      daftar_surat: "",
      arah: "BEBAS",
    },
  });

  // Watch tipe agar section HariAktifPicker bisa show/hide secara reaktif
  const watchedTipe = useWatch({ control: form.control, name: "tipe" });
  const isHarian = watchedTipe === "HARIAN";

  const openCreate = () => {
    setEditingTarget(null);
    form.reset({
      nama_target: "",
      id_kategori: undefined,
      tipe: "HARIAN",
      nilai_target: 1,
      satuan: "HALAMAN",
      deskripsi: "",
      hari_aktif: [1, 2, 3, 4, 5],
      start_juz: null as any,
      end_juz: null as any,
      daftar_surat: "",
      arah: "BEBAS",
    });
    setIsFormOpen(true);
  };

  const openEdit = (target: TargetSekolah) => {
    setEditingTarget(target);
    const hariParsed = parseHariAktif(target.hari_aktif);
    form.reset({
      nama_target: target.nama_target,
      id_kategori: target.id_kategori ?? undefined,
      tipe: target.tipe,
      nilai_target: target.nilai_target,
      satuan: target.satuan,
      deskripsi: target.deskripsi ?? "",
      // Jika tidak ada hari_aktif (target lama), default ke Senin-Jumat agar user tahu
      hari_aktif: hariParsed ?? [1, 2, 3, 4, 5],
      start_juz: target.start_juz ?? (null as any),
      end_juz: target.end_juz ?? (null as any),
      daftar_surat: target.daftar_surat ?? "",
      arah: target.arah ?? "BEBAS",
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (values: TargetFormValues) => {
    const payload = {
      ...values,
      deskripsi: values.deskripsi || null,
      // Hanya kirim hari_aktif jika tipe HARIAN
      hari_aktif: values.tipe === "HARIAN" ? (values.hari_aktif ?? null) : null,
      start_juz: values.start_juz ? Number(values.start_juz) : null,
      end_juz: values.end_juz ? Number(values.end_juz) : null,
      daftar_surat: values.daftar_surat?.trim() || null,
      arah: values.arah || "BEBAS",
    };

    if (editingTarget) {
      await updateMutation.mutateAsync({ id: editingTarget.id_target, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setIsFormOpen(false);
  };

  const handleDelete = async () => {
    if (!deletingTarget) return;
    await deleteMutation.mutateAsync(deletingTarget.id_target);
    setDeletingTarget(null);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/kepala-muhafidz/settings")}
          className="rounded-full h-10 w-10 shrink-0"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">Target Setoran</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Atur target hafalan sesuai kurikulum sekolah Anda. Setiap santri dapat ditetapkan ke
            salah satu target, atau dibiarkan tanpa target.
          </p>
        </div>
        <Button onClick={openCreate} className="ml-auto shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Target
        </Button>
      </div>

      {/* Target List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Memuat target...
        </div>
      ) : targets.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl space-y-3">
          <Target className="h-10 w-10 mx-auto text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground">Belum ada target</p>
          <p className="text-sm text-muted-foreground">
            Klik &quot;Tambah Target&quot; untuk membuat target pertama Anda.
          </p>
          <Button onClick={openCreate} variant="outline" className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Buat Target Pertama
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {targets.map((target) => {
            const hariArr = target.tipe === "HARIAN" ? parseHariAktif(target.hari_aktif) : null;
            return (
              <Card key={target.id_target} className="border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-base truncate">{target.nama_target}</p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[target.tipe] ?? "bg-muted"}`}
                        >
                          {TIPE_TARGET_LABELS[target.tipe]}
                        </span>
                        {target.kategori && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {target.kategori.nama_kategori}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="font-mono font-semibold text-foreground text-lg">
                          {target.nilai_target}
                        </span>
                        <span>{SATUAN_TARGET_LABELS[target.satuan]}</span>
                        <span className="text-xs">per {TIPE_TARGET_LABELS[target.tipe].toLowerCase()}</span>
                      </div>

                      {/* Tampilan kustomisasi arah & batasan juz/surat */}
                      {((target.arah && target.arah !== "BEBAS") || target.start_juz || target.daftar_surat) && (
                        <div className="flex flex-wrap gap-1.5 text-xs py-1">
                          {target.arah && target.arah !== "BEBAS" && (
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30">
                              Arah: {target.arah === "MAJU" ? "Maju" : "Mundur"}
                            </span>
                          )}
                          {target.start_juz !== null && target.start_juz !== undefined && target.end_juz !== null && target.end_juz !== undefined && (
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
                              Rentang: Juz {target.start_juz} s.d {target.end_juz}
                            </span>
                          )}
                          {target.daftar_surat && (
                            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30">
                              Surah: Pilihan
                            </span>
                          )}
                        </div>
                      )}

                      {/* Tampilan hari aktif untuk target HARIAN */}
                      {target.tipe === "HARIAN" && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <CalendarDays className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                          {hariArr && hariArr.length > 0 ? (
                            <div className="flex items-center gap-1 flex-wrap">
                              {hariArr.map((d) => (
                                <span
                                  key={d}
                                  className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium"
                                >
                                  {HARI_LABELS_SHORT[d]}
                                </span>
                              ))}
                              <span className="text-xs text-muted-foreground ml-1">
                                ({hariArr.length} hari/pekan)
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              {formatHariAktif([0, 1, 2, 3, 4, 5, 6])}
                            </span>
                          )}
                        </div>
                      )}

                      {target.deskripsi && (
                        <p className="text-xs text-muted-foreground line-clamp-2">{target.deskripsi}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => openEdit(target)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeletingTarget(target)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Form Dialog — Create / Edit                                       */}
      {/* ---------------------------------------------------------------- */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTarget ? "Edit Target Setoran" : "Tambah Target Setoran"}
            </DialogTitle>
            <DialogDescription>
              Buat target hafalan yang fleksibel sesuai kurikulum sekolah Anda.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Nama Target */}
              <FormField
                control={form.control}
                name="nama_target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Target <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Setoran Harian 1 Halaman" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Kategori Setoran */}
              <FormField
                control={form.control}
                name="id_kategori"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori Setoran <span className="text-red-500">*</span></FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(parseInt(val, 10))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori setoran" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingKategori ? (
                          <div className="flex items-center justify-center p-2 text-xs text-muted-foreground">
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            Memuat kategori...
                          </div>
                        ) : kategoriList.length === 0 ? (
                          <div className="p-2 text-xs text-muted-foreground">
                            Belum ada kategori setoran. Buat kategori terlebih dahulu.
                          </div>
                        ) : (
                          kategoriList.map((kat) => (
                            <SelectItem key={kat.id_kategori} value={kat.id_kategori.toString()}>
                              {kat.nama_kategori}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipe & Satuan */}
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="tipe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Periode <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih periode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TIPE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
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
                  name="satuan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Satuan <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih satuan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SATUAN_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* -------------------------------------------------------- */}
              {/* Hari Aktif Picker — hanya muncul saat tipe = HARIAN       */}
              {/* -------------------------------------------------------- */}
              {isHarian && (
                <FormField
                  control={form.control}
                  name="hari_aktif"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <HariAktifPicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Nilai Target */}
              <FormField
                control={form.control}
                name="nilai_target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nilai Target <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        min="0"
                        placeholder="Contoh: 1 (halaman) atau 15 (baris)"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Boleh desimal, contoh: 0.5 halaman (= setengah halaman = 7–8 baris)
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Deskripsi */}
              <FormField
                control={form.control}
                name="deskripsi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi <span className="text-muted-foreground">(opsional)</span></FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Contoh: Untuk santri reguler, target setoran 1 halaman per pertemuan"
                        className="resize-none"
                        rows={2}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Kustomisasi Kurikulum & Batasan */}
              <div className="border-t pt-4 space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Compass className="h-4 w-4 text-primary" />
                  Kustomisasi Kurikulum & Batasan (Opsional)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Gunakan bagian ini untuk membatasi setoran santri pada rentang tertentu atau mengatur alur/arah setoran.
                </p>

                {/* Arah Setoran */}
                <FormField
                  control={form.control}
                  name="arah"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arah Setoran</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih arah" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ARAH_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              <div className="flex flex-col text-left">
                                <span className="font-medium text-xs sm:text-sm">{opt.label}</span>
                                <span className="text-[10px] sm:text-xs text-muted-foreground">{opt.desc}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Batasan Juz */}
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="start_juz"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mulai Juz</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="30"
                            placeholder="Contoh: 1"
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val === "" ? null : parseInt(val, 10));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="end_juz"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selesai Juz</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="30"
                            placeholder="Contoh: 30"
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val === "" ? null : parseInt(val, 10));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Daftar Surah Pilihan */}
                <FormField
                  control={form.control}
                  name="daftar_surat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daftar Surah Pilihan (ID dipisah koma)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: 18,36,56,67"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <p className="text-[11px] text-muted-foreground">
                        Batasi setoran santri hanya untuk surah-surah ini. Masukkan nomor surah (ID) dipisahkan koma.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} disabled={isPending}>
                  Batal
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Menyimpan..." : "Simpan"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Info Box */}
      <div className="rounded-xl border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground space-y-1">
        <p className="font-semibold text-foreground">📐 Standar Mushaf: 15 Baris/Halaman</p>
        <p>Sistem menggunakan standar mushaf pojok (Madinah) Indonesia — 15 baris per halaman, 20 halaman per juz. Semua kalkulasi capaian menggunakan standar ini secara konsisten.</p>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingTarget} onOpenChange={() => setDeletingTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Target?</AlertDialogTitle>
            <AlertDialogDescription>
              Target <strong>&quot;{deletingTarget?.nama_target}&quot;</strong> akan dihapus. Santri yang
              menggunakan target ini akan menjadi tidak memiliki target (status Bebas).
              <br /><br />
              Tindakan ini tidak dapat dibatalkan, tetapi riwayat setoran santri tetap aman.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Hapus Target
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
