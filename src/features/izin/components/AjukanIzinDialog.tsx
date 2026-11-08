import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Term } from "@/components/ui/Term";
import {
  ajukanIzinSchema,
  type AjukanIzinFormValues,
} from "../validation/izin.schema";
import {
  JenisIzin,
  JENIS_IZIN_LABELS,
} from "../types";

interface SantriOption {
  id_santri: number;
  nama_santri: string;
  nomor_induk_santri?: string | null;
}

interface AjukanIzinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  santriList: SantriOption[];
  onSubmit: (values: AjukanIzinFormValues) => void;
  isLoading?: boolean;
}

export function AjukanIzinDialog({
  open,
  onOpenChange,
  santriList,
  onSubmit,
  isLoading = false,
}: AjukanIzinDialogProps) {
  const todayStr = new Date().toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AjukanIzinFormValues>({
    resolver: zodResolver(ajukanIzinSchema),
    defaultValues: {
      id_santri: 0,
      jenis: JenisIzin.IZIN,
      alasan: "",
      tanggal_mulai: todayStr,
      tanggal_selesai: todayStr,
    },
  });

  const selectedSantriId = watch("id_santri");
  const selectedJenis = watch("jenis");

  useEffect(() => {
    if (open) {
      reset({
        id_santri: 0,
        jenis: JenisIzin.IZIN,
        alasan: "",
        tanggal_mulai: todayStr,
        tanggal_selesai: todayStr,
      });
    }
  }, [open, reset, todayStr]);

  const onValidSubmit = (values: AjukanIzinFormValues) => {
    onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Ajukan Izin <Term code="SANTRI" /></DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-4 py-2">
          {/* Pilih Santri */}
          <div className="space-y-1.5">
            <Label htmlFor="id_santri">
              <Term code="SANTRI" /> <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedSantriId ? String(selectedSantriId) : ""}
              onValueChange={(val) => setValue("id_santri", Number(val), { shouldValidate: true })}
            >
              <SelectTrigger id="id_santri" className="w-full">
                <SelectValue placeholder="Pilih Santri..." />
              </SelectTrigger>
              <SelectContent>
                {santriList.map((santri) => (
                  <SelectItem key={santri.id_santri} value={String(santri.id_santri)}>
                    {santri.nama_santri} {santri.nomor_induk_santri ? `(${santri.nomor_induk_santri})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.id_santri && (
              <p className="text-xs text-destructive">{errors.id_santri.message}</p>
            )}
          </div>

          {/* Jenis Izin */}
          <div className="space-y-1.5">
            <Label htmlFor="jenis">
              Jenis Izin <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedJenis}
              onValueChange={(val) => setValue("jenis", val as JenisIzin, { shouldValidate: true })}
            >
              <SelectTrigger id="jenis" className="w-full">
                <SelectValue placeholder="Pilih jenis izin" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(JenisIzin).map((jenis) => (
                  <SelectItem key={jenis} value={jenis}>
                    {JENIS_IZIN_LABELS[jenis]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.jenis && (
              <p className="text-xs text-destructive">{errors.jenis.message}</p>
            )}
          </div>

          {/* Rentang Tanggal */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tanggal_mulai">
                Mulai <span className="text-destructive">*</span>
              </Label>
              <Input
                id="tanggal_mulai"
                type="date"
                {...register("tanggal_mulai")}
              />
              {errors.tanggal_mulai && (
                <p className="text-xs text-destructive">{errors.tanggal_mulai.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tanggal_selesai">
                Selesai <span className="text-destructive">*</span>
              </Label>
              <Input
                id="tanggal_selesai"
                type="date"
                {...register("tanggal_selesai")}
              />
              {errors.tanggal_selesai && (
                <p className="text-xs text-destructive">{errors.tanggal_selesai.message}</p>
              )}
            </div>
          </div>

          {/* Alasan */}
          <div className="space-y-1.5">
            <Label htmlFor="alasan">
              Alasan Izin <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="alasan"
              placeholder="Jelaskan keperluan atau keterangan sakit/izin..."
              rows={3}
              {...register("alasan")}
            />
            {errors.alasan && (
              <p className="text-xs text-destructive">{errors.alasan.message}</p>
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
              {isLoading ? "Menyimpan..." : "Kirim Pengajuan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
