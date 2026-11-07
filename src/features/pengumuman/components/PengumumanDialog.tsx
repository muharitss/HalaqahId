import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
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
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PengumumanFormValues>({
    resolver: zodResolver(pengumumanFormSchema),
    defaultValues: defaultPengumumanFormValues,
  });

  const targetType = watch("target_type");
  const isPinned = watch("is_pinned");
  const prioritas = watch("prioritas");

  // Fetch halaqah list if target_type is HALAQAH
  const { data: halaqahList = [] } = useQuery({
    queryKey: ["halaqah", "list-select"],
    queryFn: async () => halaqahManagementService.getAllHalaqah(),
    enabled: open && targetType === "HALAQAH",
  });

  // Fetch santri list if target_type is SANTRI
  const { data: santriList = [] } = useQuery({
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {itemToEdit ? "Edit Pengumuman" : "Buat Pengumuman Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-2">
          {/* Judul */}
          <div className="space-y-1.5">
            <Label htmlFor="judul">Judul Pengumuman *</Label>
            <Input
              id="judul"
              placeholder="Contoh: Libur Hari Raya Idul Fitri"
              {...register("judul")}
            />
            {errors.judul && (
              <p className="text-xs text-destructive">{errors.judul.message}</p>
            )}
          </div>

          {/* Prioritas & Pin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="prioritas">Prioritas</Label>
              <Select
                value={prioritas}
                onValueChange={(val) =>
                  setValue("prioritas", val as "NORMAL" | "PENTING" | "URGENT")
                }
              >
                <SelectTrigger id="prioritas">
                  <SelectValue placeholder="Pilih prioritas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                  <SelectItem value="PENTING">Penting</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="is_pinned"
                checked={isPinned}
                onCheckedChange={(checked) =>
                  setValue("is_pinned", Boolean(checked))
                }
              />
              <Label htmlFor="is_pinned" className="text-sm cursor-pointer">
                Sematkan di atas (Pin)
              </Label>
            </div>
          </div>

          {/* Target Audience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="target_type">Target Penerima</Label>
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
                <SelectTrigger id="target_type">
                  <SelectValue placeholder="Pilih target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Pengguna</SelectItem>
                  <SelectItem value="HALAQAH">Halaqah Tertentu</SelectItem>
                  <SelectItem value="SANTRI">Santri Tertentu</SelectItem>
                  <SelectItem value="ROLE">Role Tertentu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {targetType === "HALAQAH" && (
              <div className="space-y-1.5">
                <Label htmlFor="target_id">Pilih Halaqah</Label>
                <Select
                  value={watch("target_id") ? String(watch("target_id")) : ""}
                  onValueChange={(val) => setValue("target_id", Number(val))}
                >
                  <SelectTrigger id="target_id">
                    <SelectValue placeholder="Pilih halaqah" />
                  </SelectTrigger>
                  <SelectContent>
                    {halaqahList.map((h: Halaqah) => (
                      <SelectItem
                        key={h.id_halaqah}
                        value={String(h.id_halaqah)}
                      >
                        {h.name_halaqah}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {targetType === "SANTRI" && (
              <div className="space-y-1.5">
                <Label htmlFor="target_id">Pilih Santri</Label>
                <Select
                  value={watch("target_id") ? String(watch("target_id")) : ""}
                  onValueChange={(val) => setValue("target_id", Number(val))}
                >
                  <SelectTrigger id="target_id">
                    <SelectValue placeholder="Pilih santri" />
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    {santriList.map((s: Santri) => (
                      <SelectItem
                        key={s.id_santri}
                        value={String(s.id_santri)}
                      >
                        {s.nama_santri}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Tanggal Mulai & Tanggal Selesai */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="tanggal_mulai">Tanggal Mulai (Opsional)</Label>
              <Input
                id="tanggal_mulai"
                type="datetime-local"
                {...register("tanggal_mulai")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tanggal_selesai">Tanggal Selesai (Opsional)</Label>
              <Input
                id="tanggal_selesai"
                type="datetime-local"
                {...register("tanggal_selesai")}
              />
            </div>
          </div>

          {/* Isi Pengumuman */}
          <div className="space-y-1.5">
            <Label htmlFor="isi">Isi Pengumuman *</Label>
            <Textarea
              id="isi"
              rows={5}
              placeholder="Tuliskan isi pengumuman secara rinci di sini..."
              {...register("isi")}
            />
            {errors.isi && (
              <p className="text-xs text-destructive">{errors.isi.message}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : itemToEdit ? "Simpan Perubahan" : "Publikasikan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
