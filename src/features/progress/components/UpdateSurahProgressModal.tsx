import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SurahProgressItem, StatusProgress } from "../types";
import { useProgressMutations } from "../api/mutations/useProgressMutations";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";

interface UpdateSurahProgressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  surah: SurahProgressItem | null;
  santriId?: number;
}

export function UpdateSurahProgressModal({
  open,
  onOpenChange,
  surah,
  santriId,
}: UpdateSurahProgressModalProps) {
  const { updateProgressMutation } = useProgressMutations(santriId);

  const [status, setStatus] = useState<StatusProgress>("BELUM");
  const [persentase, setPersentase] = useState(0);
  const [ayatTerakhir, setAyatTerakhir] = useState<number | "">("");
  const [halamanTerakhir, setHalamanTerakhir] = useState<number | "">("");
  const [totalPengulangan, setTotalPengulangan] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (surah) {
      setStatus(surah.status);
      setPersentase(Math.round(surah.persentase));
      setAyatTerakhir(surah.ayat_terakhir ?? "");
      setHalamanTerakhir(surah.halaman_terakhir ?? "");
      setTotalPengulangan(surah.total_pengulangan || 0);
    }
  }, [surah, open]);

  if (!surah) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!santriId) return;

    setIsSubmitting(true);
    try {
      await updateProgressMutation.mutateAsync({
        suratId: surah.id_surat,
        payload: {
          status,
          persentase: Number(persentase),
          ayat_terakhir: ayatTerakhir === "" ? null : Number(ayatTerakhir),
          halaman_terakhir: halamanTerakhir === "" ? null : Number(halamanTerakhir),
          total_pengulangan: Number(totalPengulangan),
        },
      });

      toast.success(`Progress Surah ${surah.nama_latin} berhasil diperbarui`);
      onOpenChange(false);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Gagal memperbarui progres surat"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center justify-between">
            <span>
              {surah.id_surat}. {surah.nama_latin}
            </span>
            <span className="font-serif text-primary text-base font-bold">
              {surah.nama_surat}
            </span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            {surah.arti} · Total {surah.jumlah_ayat} Ayat · {surah.tempat_turun}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Status Hafalan</Label>
            <Select
              value={status}
              onValueChange={(val) => {
                const nextSt = val as StatusProgress;
                setStatus(nextSt);
                if (nextSt === "SELESAI" || nextSt === "LANCAR") {
                  setPersentase(100);
                  setAyatTerakhir(surah.jumlah_ayat);
                } else if (nextSt === "BELUM") {
                  setPersentase(0);
                  setAyatTerakhir("");
                }
              }}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BELUM">Belum Menghafal</SelectItem>
                <SelectItem value="PROSES">Sedang Proses</SelectItem>
                <SelectItem value="SELESAI">Selesai / Tuntas</SelectItem>
                <SelectItem value="LANCAR">Mutqin / Lancar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Persentase (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={persentase}
                onChange={(e) => setPersentase(Number(e.target.value))}
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Ayat Terakhir</Label>
              <Input
                type="number"
                min={1}
                max={surah.jumlah_ayat}
                placeholder={`1-${surah.jumlah_ayat}`}
                value={ayatTerakhir}
                onChange={(e) =>
                  setAyatTerakhir(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Halaman Terakhir</Label>
              <Input
                type="number"
                min={1}
                max={604}
                placeholder="1-604"
                value={halamanTerakhir}
                onChange={(e) =>
                  setHalamanTerakhir(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Total Pengulangan</Label>
              <Input
                type="number"
                min={0}
                value={totalPengulangan}
                onChange={(e) => setTotalPengulangan(Number(e.target.value))}
                className="h-8 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
