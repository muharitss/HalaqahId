"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Loader2 } from "lucide-react";
import { type Santri } from "../types";
import { type Halaqah } from "@/features/halaqah/api/halaqahService";
import { useTargetList } from "@/features/settings/hooks/useTarget";
import { TIPE_TARGET_LABELS, SATUAN_TARGET_LABELS } from "@/types/domain/target";

interface SantriModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    nama_santri: string;
    nomor_telepon: string;
    id_target: number | null;
    id_halaqah: number | undefined;
  }) => void;
  selectedSantri: Partial<Santri> | null;
  isAdmin: boolean;
  halaqahList: Halaqah[];
  isSubmitting: boolean;
}

export function SantriModal({
  isOpen,
  onClose,
  onSave,
  selectedSantri,
  isSubmitting,
  isAdmin,
  halaqahList,
}: SantriModalProps) {
  const [halaqahId, setHalaqahId] = useState<string>("");
  const [targetId, setTargetId] = useState<string>("__none__");
  const [namaSantri, setNamaSantri] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");

  const { data: targetList = [], isLoading: isLoadingTargets } = useTargetList();

  // Reset form saat modal dibuka atau santri berubah
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setNamaSantri(selectedSantri?.nama_santri ?? "");
        setNomorTelepon(selectedSantri?.nomor_telepon ?? "");
        setHalaqahId(selectedSantri?.id_halaqah?.toString() ?? "");
        // id_target dari data santri — jika ada, set sebagai string; jika null → "__none__"
        const existingTarget = selectedSantri?.id_target;
        setTargetId(existingTarget ? existingTarget.toString() : "__none__");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, selectedSantri]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedTargetId = targetId === "__none__" ? null : parseInt(targetId, 10);
    const parsedHalaqahId = halaqahId ? parseInt(halaqahId, 10) : undefined;

    onSave({
      nama_santri: namaSantri,
      nomor_telepon: nomorTelepon,
      id_target: parsedTargetId,
      id_halaqah: parsedHalaqahId,
    });
  };

  const isAutoHalaqah = !selectedSantri?.id_santri && selectedSantri?.id_halaqah;

  const selectedTarget = targetList.find(
    (t) => t.id_target.toString() === targetId
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {selectedSantri?.id_santri ? "Edit Data Santri" : "Tambah Santri Baru"}
            </DialogTitle>
            <DialogDescription>
              Isi data santri di bawah ini. Target setoran bersifat opsional.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Nama */}
            <div className="grid gap-2">
              <Label htmlFor="nama_santri">Nama Lengkap *</Label>
              <Input
                id="nama_santri"
                name="nama_santri"
                value={namaSantri}
                onChange={(e) => setNamaSantri(e.target.value)}
                required
                placeholder="Masukkan nama lengkap santri"
              />
            </div>

            {/* Nomor Telepon */}
            <div className="grid gap-2">
              <Label htmlFor="nomor_telepon">Nomor Telepon *</Label>
              <Input
                id="nomor_telepon"
                name="nomor_telepon"
                value={nomorTelepon}
                onChange={(e) => setNomorTelepon(e.target.value)}
                required
                type="tel"
                placeholder="Contoh: 08123456789"
              />
            </div>

            {/* Target Setoran */}
            <div className="grid gap-2">
              <Label htmlFor="id_target">
                Target Setoran
                <span className="ml-1 text-xs text-muted-foreground font-normal">(opsional)</span>
              </Label>
              {isLoadingTargets ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground h-9 px-3 border rounded-md">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Memuat target...
                </div>
              ) : (
                <Select value={targetId} onValueChange={setTargetId}>
                  <SelectTrigger id="id_target">
                    <SelectValue placeholder="Pilih target atau biarkan kosong" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground italic">Tanpa Target (Bebas)</span>
                      </div>
                    </SelectItem>
                    {targetList.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-muted-foreground">
                        Belum ada target. Buat target di Pengaturan → Target Setoran.
                      </div>
                    ) : (
                      targetList.map((target) => (
                        <SelectItem
                          key={target.id_target}
                          value={target.id_target.toString()}
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium">{target.nama_target}</span>
                            <span className="text-xs text-muted-foreground">
                              {target.nilai_target} {SATUAN_TARGET_LABELS[target.satuan]}/
                              {TIPE_TARGET_LABELS[target.tipe].toLowerCase()}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}

              {/* Preview target terpilih */}
              {selectedTarget && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
                  <span>
                    🎯 {selectedTarget.nilai_target}{" "}
                    {SATUAN_TARGET_LABELS[selectedTarget.satuan]} per{" "}
                    {TIPE_TARGET_LABELS[selectedTarget.tipe].toLowerCase()}
                  </span>
                  {selectedTarget.deskripsi && (
                    <span className="hidden sm:inline">— {selectedTarget.deskripsi}</span>
                  )}
                </div>
              )}
            </div>

            {/* Halaqah — hanya admin & bukan auto-halaqah */}
            {isAdmin && !isAutoHalaqah && (
              <div className="grid gap-2">
                <Label htmlFor="id_halaqah">Pilih Halaqah</Label>
                <Select value={halaqahId} onValueChange={setHalaqahId}>
                  <SelectTrigger id="id_halaqah">
                    <SelectValue placeholder="Pilih halaqah" />
                  </SelectTrigger>
                  <SelectContent>
                    {halaqahList.map((h) => (
                      <SelectItem key={h.id_halaqah} value={h.id_halaqah.toString()}>
                        {h.name_halaqah}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Info halaqah otomatis */}
            {isAutoHalaqah && (
              <div className="bg-muted/50 p-3 rounded-md border border-dashed">
                <p className="text-[10px] uppercase text-muted-foreground font-bold">
                  Halaqah Tujuan
                </p>
                <p className="text-sm font-semibold">
                  {halaqahList.find(
                    (h) => h.id_halaqah.toString() === halaqahId
                  )?.name_halaqah ?? "Halaqah saat ini"}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
