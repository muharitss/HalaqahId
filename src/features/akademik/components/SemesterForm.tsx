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
  Semester,
  CreateSemesterPayload,
  UpdateSemesterPayload,
} from "../types";

interface SemesterFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idTahunAjaran: number;
  initialData?: Semester | null;
  onSubmit: (payload: CreateSemesterPayload | UpdateSemesterPayload) => Promise<void>;
  isSubmitting?: boolean;
}

export function SemesterForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting = false,
}: SemesterFormProps) {
  const [nama, setNama] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
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
    } else {
      setNama("");
      setTanggalMulai("");
      setTanggalSelesai("");
    }
    setError(null);
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setError("Nama semester wajib diisi");
      return;
    }
    if (!tanggalMulai || !tanggalSelesai) {
      setError("Tanggal mulai dan tanggal selesai semester wajib diisi");
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
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Edit Semester" : "Tambah Semester"}
            </DialogTitle>
            <DialogDescription>
              {initialData
                ? "Perbarui periode semester akademik."
                : "Tentukan nama semester dan rentang tanggal pelaksanaan semester."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <div className="p-3 text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="nama-semester">Nama Semester</Label>
              <Input
                id="nama-semester"
                placeholder="Contoh: Semester Ganjil / Genap"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tgl-mulai-sem">Tanggal Mulai</Label>
                <Input
                  id="tgl-mulai-sem"
                  type="date"
                  value={tanggalMulai}
                  onChange={(e) => setTanggalMulai(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tgl-selesai-sem">Tanggal Selesai</Label>
                <Input
                  id="tgl-selesai-sem"
                  type="date"
                  value={tanggalSelesai}
                  onChange={(e) => setTanggalSelesai(e.target.value)}
                  required
                />
              </div>
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
