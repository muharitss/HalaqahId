import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Santri {
  id_santri: number;
  nama: string;
  target: "RINGAN" | "SEDANG" | "INTENS" | "CUSTOM_KHUSUS";
  halaqah_id: number;
}

interface SantriModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Santri>) => void;
  editingSantri?: Santri | null;
}

export function SantriModal({ isOpen, onClose, onSave, editingSantri }: SantriModalProps) {
  const [nama, setNama] = useState("");
  const [target, setTarget] = useState<Santri["target"]>("SEDANG");

  // Reset atau isi form saat modal dibuka
  useEffect(() => {
    if (editingSantri) {
      setNama(editingSantri.nama);
      setTarget(editingSantri.target);
    } else {
      setNama("");
      setTarget("SEDANG");
    }
  }, [editingSantri, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      nama,
      target,
      halaqah_id: 1, // Default sementara
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editingSantri ? "Edit Data Santri" : "Tambah Santri Baru"}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input
                id="nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama santri"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="target">Target Hafalan</Label>
              <select
                id="target"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={target}
                onChange={(e) => setTarget(e.target.value as Santri["target"])}
              >
                <option value="RINGAN">Ringan (1-2 Halaman)</option>
                <option value="SEDANG">Sedang (3-4 Halaman)</option>
                <option value="INTENS">Intens (5-6 Halaman)</option>
                <option value="CUSTOM_KHUSUS">Khusus</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="bg-primary">
              Simpan Data
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}