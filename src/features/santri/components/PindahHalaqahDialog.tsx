import React, { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Term } from "@/components/ui/Term";
import { ArrowRightLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { type Santri } from "../types";
import { usePindahHalaqah } from "../api/mutations/usePindahHalaqah";
import { pindahHalaqahSchema } from "../validation/pindah-halaqah.schema";

interface HalaqahOption {
  id_halaqah: number;
  name_halaqah?: string;
  nama_halaqah?: string;
}

export interface PindahHalaqahDialogProps {
  isOpen: boolean;
  onClose: () => void;
  santri: Santri | null;
  halaqahList: HalaqahOption[];
  onSuccess?: () => void;
}

export function PindahHalaqahDialog({
  isOpen,
  onClose,
  santri,
  halaqahList,
  onSuccess,
}: PindahHalaqahDialogProps) {
  const [idHalaqahBaru, setIdHalaqahBaru] = useState<string>("");
  const [alasan, setAlasan] = useState<string>("");
  const [tanggalPindah, setTanggalPindah] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  const pindahMutation = usePindahHalaqah(() => {
    toast.success("Berhasil memindahkan santri ke halaqah baru");
    onSuccess?.();
    handleClose();
  });

  useEffect(() => {
    if (isOpen) {
      setIdHalaqahBaru("");
      setAlasan("");
      const now = new Date();
      // Format to YYYY-MM-DDTHH:mm for datetime-local input
      const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setTanggalPindah(localIso);
      setFormError(null);
    }
  }, [isOpen]);

  const handleClose = () => {
    setFormError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!santri) return;

    const validation = pindahHalaqahSchema.safeParse({
      id_halaqah_baru: idHalaqahBaru,
      alasan: alasan.trim() || undefined,
      tanggal_pindah: tanggalPindah ? new Date(tanggalPindah).toISOString() : undefined,
    });

    if (!validation.success) {
      const issue = validation.error.issues[0];
      setFormError(issue?.message || "Validasi gagal");
      return;
    }

    if (Number(idHalaqahBaru) === santri.id_halaqah) {
      setFormError("Halaqah tujuan harus berbeda dengan halaqah saat ini");
      return;
    }

    setFormError(null);

    try {
      await pindahMutation.mutateAsync({
        id: santri.id_santri,
        data: {
          id_halaqah_baru: Number(idHalaqahBaru),
          alasan: alasan.trim() || undefined,
          tanggal_pindah: tanggalPindah ? new Date(tanggalPindah).toISOString() : undefined,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memindahkan santri";
      setFormError(msg);
      toast.error(msg);
    }
  };

  const currentHalaqahName =
    halaqahList.find((h) => h.id_halaqah === santri?.id_halaqah)?.nama_halaqah ||
    halaqahList.find((h) => h.id_halaqah === santri?.id_halaqah)?.name_halaqah ||
    `Halaqah #${santri?.id_halaqah}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-primary" />
              Pindah <Term code="HALAQAH" /> <Term code="SANTRI" />
            </DialogTitle>
            <DialogDescription>
              Pindahkan <strong>{santri?.nama_santri}</strong> dari{" "}
              <span className="font-semibold text-foreground">{currentHalaqahName}</span> ke{" "}
              <Term code="HALAQAH" /> lain.
            </DialogDescription>
          </DialogHeader>

          {formError && (
            <div className="p-3 text-xs rounded-md bg-destructive/10 text-destructive border border-destructive/20 font-medium">
              {formError}
            </div>
          )}

          <div className="space-y-4 py-2">
            {/* Halaqah Tujuan */}
            <div className="space-y-2">
              <Label htmlFor="id_halaqah_baru">
                Pilih <Term code="HALAQAH" /> Tujuan <span className="text-destructive">*</span>
              </Label>
              <Select value={idHalaqahBaru} onValueChange={setIdHalaqahBaru}>
                <SelectTrigger id="id_halaqah_baru">
                  <SelectValue placeholder="Pilih halaqah baru..." />
                </SelectTrigger>
                <SelectContent>
                  {halaqahList.map((h) => {
                    const name = h.nama_halaqah || h.name_halaqah || `Halaqah #${h.id_halaqah}`;
                    const isCurrent = h.id_halaqah === santri?.id_halaqah;
                    return (
                      <SelectItem
                        key={h.id_halaqah}
                        value={h.id_halaqah.toString()}
                        disabled={isCurrent}
                      >
                        {name} {isCurrent && "(Saat Ini)"}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Tanggal Pindah */}
            <div className="space-y-2">
              <Label htmlFor="tanggal_pindah">Tanggal & Waktu Pindah</Label>
              <Input
                id="tanggal_pindah"
                type="datetime-local"
                value={tanggalPindah}
                onChange={(e) => setTanggalPindah(e.target.value)}
              />
            </div>

            {/* Alasan */}
            <div className="space-y-2">
              <Label htmlFor="alasan">
                Alasan Perpindahan
                <span className="ml-1 text-xs text-muted-foreground font-normal">(opsional)</span>
              </Label>
              <Textarea
                id="alasan"
                rows={3}
                placeholder="Contoh: Penyesuaian jadwal atau jenjang hafalan santri"
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={pindahMutation.isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={!idHalaqahBaru || pindahMutation.isPending}
            >
              {pindahMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {pindahMutation.isPending ? "Memindahkan..." : "Simpan Perpindahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
