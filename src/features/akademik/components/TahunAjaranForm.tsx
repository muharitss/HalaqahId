import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type {
  TahunAjaran,
  CreateTahunAjaranPayload,
  UpdateTahunAjaranPayload,
} from "../types";

interface TahunAjaranFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: TahunAjaran | null;
  onSubmit: (payload: CreateTahunAjaranPayload | UpdateTahunAjaranPayload) => Promise<void>;
  isSubmitting?: boolean;
}

export function TahunAjaranForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting = false,
}: TahunAjaranFormProps) {
  const [nama, setNama] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [isAktif, setIsAktif] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setNama(initialData.nama);
      setTanggalMulai(
        initialData.tanggal_mulai ? initialData.tanggal_mulai.slice(0, 10) : ""
      );
      setTanggalSelesai(
        initialData.tanggal_selesai ? initialData.tanggal_selesai.slice(0, 10) : ""
      );
      setIsAktif(!!initialData.is_aktif);
    } else {
      setNama("");
      setTanggalMulai("");
      setTanggalSelesai("");
      setIsAktif(false);
    }
    setError(null);
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setError("Nama tahun ajaran wajib diisi");
      return;
    }
    if (!tanggalMulai || !tanggalSelesai) {
      setError("Tanggal mulai dan tanggal selesai wajib diisi");
      return;
    }
    if (new Date(tanggalMulai) > new Date(tanggalSelesai)) {
      setError("Tanggal mulai tidak boleh lebih besar dari tanggal selesai");
      return;
    }

    setError(null);
    await onSubmit({
      nama: nama.trim(),
      tanggal_mulai: tanggalMulai,
      tanggal_selesai: tanggalSelesai,
      is_aktif: isAktif,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Edit Tahun Ajaran" : "Tambah Tahun Ajaran"}
            </DialogTitle>
            <DialogDescription>
              {initialData
                ? "Perbarui periode tahun ajaran akademik sekolah."
                : "Tentukan nama periode dan rentang tanggal tahun ajaran baru."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <div className="p-3 text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="nama-ta">Nama Tahun Ajaran</Label>
              <Input
                id="nama-ta"
                placeholder="Contoh: 2026/2027"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tgl-mulai-ta">Tanggal Mulai</Label>
                <Input
                  id="tgl-mulai-ta"
                  type="date"
                  value={tanggalMulai}
                  onChange={(e) => setTanggalMulai(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tgl-selesai-ta">Tanggal Selesai</Label>
                <Input
                  id="tgl-selesai-ta"
                  type="date"
                  value={tanggalSelesai}
                  onChange={(e) => setTanggalSelesai(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="is-aktif-ta"
                checked={isAktif}
                onCheckedChange={(checked) => setIsAktif(checked === true)}
              />
              <Label
                htmlFor="is-aktif-ta"
                className="text-sm font-normal cursor-pointer"
              >
                Jadikan sebagai Tahun Ajaran Aktif
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
