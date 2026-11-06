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
import type {
  HariLibur,
  CreateHariLiburPayload,
  UpdateHariLiburPayload,
} from "../types";

interface HariLiburFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: HariLibur | null;
  onSubmit: (payload: CreateHariLiburPayload | UpdateHariLiburPayload) => Promise<void>;
  isSubmitting?: boolean;
}

export function HariLiburForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting = false,
}: HariLiburFormProps) {
  const [tanggal, setTanggal] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTanggal(initialData.tanggal ? initialData.tanggal.slice(0, 10) : "");
      setKeterangan(initialData.keterangan);
    } else {
      setTanggal(new Date().toISOString().slice(0, 10));
      setKeterangan("");
    }
    setError(null);
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tanggal) {
      setError("Tanggal libur wajib diisi");
      return;
    }
    if (!keterangan.trim()) {
      setError("Keterangan libur wajib diisi");
      return;
    }

    setError(null);
    await onSubmit({
      tanggal,
      keterangan: keterangan.trim(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Edit Hari Libur" : "Tambah Hari Libur"}
            </DialogTitle>
            <DialogDescription>
              {initialData
                ? "Perbarui tanggal atau keterangan hari libur sekolah."
                : "Catat hari libur atau cuti bersama di kalender akademik."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <div className="p-3 text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="tgl-libur">Tanggal</Label>
              <Input
                id="tgl-libur"
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ket-libur">Keterangan / Nama Hari Libur</Label>
              <Input
                id="ket-libur"
                placeholder="Contoh: Hari Raya Idul Fitri"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                required
              />
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
