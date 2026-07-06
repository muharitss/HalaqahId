import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Target, ChevronLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

import {
  useTargetList,
  useCreateTarget,
  useUpdateTarget,
  useDeleteTarget,
} from "../hooks/useTarget";
import { targetSchema, type TargetFormValues } from "@/utils/zodSchema";
import type { TargetSekolah } from "@/types/domain/target";
import { TIPE_TARGET_LABELS, SATUAN_TARGET_LABELS } from "@/types/domain/target";

const TIPE_OPTIONS = [
  { value: "HARIAN", label: "Harian", desc: "Dievaluasi setiap hari" },
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

const STATUS_COLORS: Record<string, string> = {
  HARIAN: "bg-blue-100 text-blue-700 dark:bg-blue-900/30",
  MINGGUAN: "bg-violet-100 text-violet-700 dark:bg-violet-900/30",
  BULANAN: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30",
  SEMESTER: "bg-amber-100 text-amber-700 dark:bg-amber-900/30",
  GLOBAL: "bg-slate-100 text-slate-700 dark:bg-slate-800",
};

export default function TargetSettingsPage() {
  const navigate = useNavigate();
  const { data: targets = [], isLoading } = useTargetList();
  const createMutation = useCreateTarget();
  const updateMutation = useUpdateTarget();
  const deleteMutation = useDeleteTarget();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<TargetSekolah | null>(null);
  const [deletingTarget, setDeletingTarget] = useState<TargetSekolah | null>(null);

  const form = useForm<TargetFormValues>({
    resolver: zodResolver(targetSchema) as Resolver<TargetFormValues>,
    defaultValues: {
      nama_target: "",
      tipe: "HARIAN",
      nilai_target: 1,
      satuan: "HALAMAN",
      deskripsi: "",
    },
  });

  const openCreate = () => {
    setEditingTarget(null);
    form.reset({
      nama_target: "",
      tipe: "HARIAN",
      nilai_target: 1,
      satuan: "HALAMAN",
      deskripsi: "",
    });
    setIsFormOpen(true);
  };

  const openEdit = (target: TargetSekolah) => {
    setEditingTarget(target);
    form.reset({
      nama_target: target.nama_target,
      tipe: target.tipe,
      nilai_target: target.nilai_target,
      satuan: target.satuan,
      deskripsi: target.deskripsi ?? "",
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (values: TargetFormValues) => {
    const payload = {
      ...values,
      deskripsi: values.deskripsi || null,
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
            Atur target hafalan sesuai kurikulum sekolah Anda. Setiap santri dapat ditetapkan ke salah satu target, atau dibiarkan tanpa target.
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
          {targets.map((target) => (
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
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="font-mono font-semibold text-foreground text-lg">
                        {target.nilai_target}
                      </span>
                      <span>{SATUAN_TARGET_LABELS[target.satuan]}</span>
                      <span className="text-xs">per {TIPE_TARGET_LABELS[target.tipe].toLowerCase()}</span>
                    </div>
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
          ))}
        </div>
      )}

      {/* Form Dialog — Create / Edit */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingTarget ? "Edit Target Setoran" : "Tambah Target Baru"}
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
                    <FormLabel>Nama Target *</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Setoran Harian 1 Halaman" {...field} />
                    </FormControl>
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
                      <FormLabel>Periode *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih periode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TIPE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              <div>
                                <p className="font-medium">{opt.label}</p>
                                <p className="text-xs text-muted-foreground">{opt.desc}</p>
                              </div>
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
                      <FormLabel>Satuan *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih satuan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SATUAN_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              <div>
                                <p className="font-medium">{opt.label}</p>
                                <p className="text-xs text-muted-foreground">{opt.hint}</p>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Nilai Target */}
              <FormField
                control={form.control}
                name="nilai_target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nilai Target *</FormLabel>
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
                      Boleh desimal, contoh: 0.5 halaman (= setengah halaman = 7-8 baris)
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

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingTarget ? "Simpan Perubahan" : "Tambah Target"}
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
