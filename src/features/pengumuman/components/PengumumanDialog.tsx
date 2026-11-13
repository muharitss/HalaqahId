import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Pin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Term } from "@/components/ui/Term";
import { halaqahManagementService, type Halaqah } from "@/features/halaqah";
import { santriService, type Santri } from "@/features/santri";
import {
  pengumumanFormSchema,
  defaultPengumumanFormValues,
  type PengumumanFormValues,
} from "../modules/form/validation/pengumumanSchema";
import type { PengumumanItem } from "../types";

interface PengumumanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemToEdit?: PengumumanItem | null;
  onSubmit: (values: PengumumanFormValues) => void;
  isLoading?: boolean;
}

export function PengumumanDialog({
  open,
  onOpenChange,
  itemToEdit,
  onSubmit,
  isLoading = false,
}: PengumumanDialogProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PengumumanFormValues>({
    resolver: zodResolver(pengumumanFormSchema),
    defaultValues: defaultPengumumanFormValues,
  });

  const targetType = useWatch({ control, name: "target_type" });
  const isPinned = useWatch({ control, name: "is_pinned" });
  const prioritas = useWatch({ control, name: "prioritas" });
  const targetId = useWatch({ control, name: "target_id" });
  const judul = useWatch({ control, name: "judul" }) || "";

  const { data: halaqahList = [], isLoading: isLoadingHalaqah } = useQuery({
    queryKey: ["halaqah", "list-select"],
    queryFn: async () => halaqahManagementService.getAllHalaqah(),
    enabled: open && targetType === "HALAQAH",
  });

  const { data: santriList = [], isLoading: isLoadingSantri } = useQuery({
    queryKey: ["santri", "list-select"],
    queryFn: async () => {
      const res = await santriService.getAll();
      return Array.isArray(res) ? res : [];
    },
    enabled: open && targetType === "SANTRI",
  });

  useEffect(() => {
    if (open) {
      if (itemToEdit) {
        const primaryTarget = itemToEdit.targets?.[0];
        reset({
          judul: itemToEdit.judul,
          isi: itemToEdit.isi,
          prioritas: itemToEdit.prioritas,
          is_pinned: itemToEdit.is_pinned,
          tanggal_mulai: itemToEdit.tanggal_mulai
            ? itemToEdit.tanggal_mulai.slice(0, 16)
            : null,
          tanggal_selesai: itemToEdit.tanggal_selesai
            ? itemToEdit.tanggal_selesai.slice(0, 16)
            : null,
          target_type: primaryTarget?.target_type || "ALL",
          target_id: primaryTarget?.target_id ?? null,
        });
      } else {
        reset(defaultPengumumanFormValues);
      }
    }
  }, [open, itemToEdit, reset]);

  const handleFormSubmit = (data: PengumumanFormValues) => {
    onSubmit({
      ...data,
      target_id:
        data.target_type === "ALL" ? null : data.target_id ? Number(data.target_id) : null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold tracking-tight">
            {itemToEdit ? "Edit Pengumuman" : "Buat Pengumuman Baru"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {itemToEdit
              ? "Perbarui rincian pengumuman yang telah dibuat sebelumnya."
              : "Sampaikan informasi, edaran resmi, atau pengumuman ke seluruh atau sebagian civitas."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-1">
          {/* Judul */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="judul" className="text-xs font-semibold">
                Judul Pengumuman <span className="text-destructive">*</span>
              </Label>
              <span className="text-[10px] text-muted-foreground tabular-nums">
                {judul.length}/255
              </span>
            </div>
            <Input
              id="judul"
              placeholder="Contoh: Libur Hari Raya Idul Fitri 1448 H"
              {...register("judul")}
              className="h-9"
            />
            {errors.judul && (
              <p className="text-xs text-destructive">{errors.judul.message}</p>
            )}
          </div>

          {/* Prioritas & Target Penerima */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="prioritas" className="text-xs font-semibold">
                Prioritas
              </Label>
              <Select
                value={prioritas}
                onValueChange={(val) =>
                  setValue("prioritas", val as "NORMAL" | "PENTING" | "URGENT")
                }
              >
                <SelectTrigger id="prioritas" className="h-9">
                  <SelectValue placeholder="Pilih prioritas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                  <SelectItem value="PENTING">Penting</SelectItem>
                  <SelectItem value="URGENT">Urgent (Mendesak)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="target_type" className="text-xs font-semibold">
                Target Penerima
              </Label>
              <Select
                value={targetType}
                onValueChange={(val) => {
                  setValue(
                    "target_type",
                    val as "ALL" | "HALAQAH" | "LEVEL" | "SANTRI" | "ROLE" | "USER"
                  );
                  setValue("target_id", null);
                }}
              >
                <SelectTrigger id="target_type" className="h-9">
                  <SelectValue placeholder="Pilih target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Pengguna</SelectItem>
                  <SelectItem value="HALAQAH">
                    <Term code="HALAQAH" /> Tertentu
                  </SelectItem>
                  <SelectItem value="SANTRI">
                    <Term code="SANTRI" /> Tertentu
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conditional Target Selector */}
          {targetType === "HALAQAH" && (
            <div className="space-y-1.5 p-3 rounded-lg bg-muted/40 border">
              <Label htmlFor="target_id" className="text-xs font-semibold">
                Pilih <Term code="HALAQAH" /> Tujuan
              </Label>
              <Select
                value={targetId ? String(targetId) : ""}
                onValueChange={(val) => setValue("target_id", Number(val))}
              >
                <SelectTrigger id="target_id" className="h-9 bg-background">
                  <SelectValue placeholder="Pilih salah satu halaqah..." />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {isLoadingHalaqah ? (
                    <SelectItem value="__loading" disabled>
                      Memuat daftar halaqah...
                    </SelectItem>
                  ) : halaqahList.length === 0 ? (
                    <SelectItem value="__empty" disabled>
                      Tidak ada data halaqah
                    </SelectItem>
                  ) : (
                    halaqahList.map((h: Halaqah) => (
                      <SelectItem
                        key={h.id_halaqah}
                        value={String(h.id_halaqah)}
                      >
                        {h.name_halaqah}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {targetType === "SANTRI" && (
            <div className="space-y-1.5 p-3 rounded-lg bg-muted/40 border">
              <Label htmlFor="target_id" className="text-xs font-semibold">
                Pilih <Term code="SANTRI" /> Tujuan
              </Label>
              <Select
                value={targetId ? String(targetId) : ""}
                onValueChange={(val) => setValue("target_id", Number(val))}
              >
                <SelectTrigger id="target_id" className="h-9 bg-background">
                  <SelectValue placeholder="Pilih salah satu santri..." />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {isLoadingSantri ? (
                    <SelectItem value="__loading" disabled>
                      Memuat daftar santri...
                    </SelectItem>
                  ) : santriList.length === 0 ? (
                    <SelectItem value="__empty" disabled>
                      Tidak ada data santri
                    </SelectItem>
                  ) : (
                    santriList.map((s: Santri) => (
                      <SelectItem
                        key={s.id_santri}
                        value={String(s.id_santri)}
                      >
                        {s.nama_santri}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Isi Pengumuman */}
          <div className="space-y-1.5">
            <Label htmlFor="isi" className="text-xs font-semibold">
              Isi Pengumuman <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="isi"
              rows={5}
              placeholder="Tuliskan isi pengumuman atau edaran secara jelas dan rinci di sini..."
              {...register("isi")}
              className="resize-y text-sm leading-relaxed"
            />
            {errors.isi && (
              <p className="text-xs text-destructive">{errors.isi.message}</p>
            )}
          </div>

          {/* Jadwal Tayang */}
          <div className="p-3 rounded-lg bg-muted/30 border space-y-2">
            <p className="text-xs font-medium text-foreground">
              Jadwal Publikasi <span className="text-muted-foreground font-normal">(Opsional)</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="tanggal_mulai" className="text-[11px] text-muted-foreground">
                  Mulai Ditampilkan
                </Label>
                <Input
                  id="tanggal_mulai"
                  type="datetime-local"
                  {...register("tanggal_mulai")}
                  className="h-8 text-xs bg-background"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="tanggal_selesai" className="text-[11px] text-muted-foreground">
                  Berakhir Ditampilkan
                </Label>
                <Input
                  id="tanggal_selesai"
                  type="datetime-local"
                  {...register("tanggal_selesai")}
                  className="h-8 text-xs bg-background"
                />
              </div>
            </div>
          </div>

          {/* Pin Option */}
          <label
            htmlFor="is_pinned"
            className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/30 transition-colors"
          >
            <Checkbox
              id="is_pinned"
              checked={isPinned}
              onCheckedChange={(checked) =>
                setValue("is_pinned", Boolean(checked))
              }
              className="mt-0.5"
            />
            <div className="space-y-0.5 select-none">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Pin className="h-3 w-3 text-muted-foreground -rotate-45 fill-current" />
                Sematkan Pengumuman (Pin)
              </span>
              <span className="text-[11px] text-muted-foreground block leading-tight">
                Pengumuman yang disematkan akan selalu berada di posisi paling atas daftar.
              </span>
            </div>
          </label>

          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" size="sm" disabled={isLoading} className="gap-2">
              {isLoading && <Spinner className="h-3.5 w-3.5" />}
              {isLoading
                ? "Menyimpan..."
                : itemToEdit
                ? "Simpan Perubahan"
                : "Publikasikan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
