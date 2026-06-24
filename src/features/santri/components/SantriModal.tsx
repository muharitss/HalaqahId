"use client";

import React, { useState } from "react";
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
  Select
} from "@/components/ui/select";
import { type Santri } from "../types";
import { type Halaqah } from "@/features/halaqah/api/halaqahService";

interface SantriModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    nama_santri: string | FormDataEntryValue | null;
    nomor_telepon: string | FormDataEntryValue | null;
    target: string;
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
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevSantri, setPrevSantri] = useState(selectedSantri);

  if (isOpen !== prevIsOpen || selectedSantri !== prevSantri) {
    setPrevIsOpen(isOpen);
    setPrevSantri(selectedSantri);
    if (isOpen) {
      setHalaqahId(selectedSantri?.id_halaqah?.toString() || "");
    }
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      nama_santri: formData.get("nama_santri"),
      nomor_telepon: formData.get("nomor_telepon"),
      target: selectedSantri?.target || "SEDANG",
      id_halaqah: halaqahId ? parseInt(halaqahId, 10) : undefined,
    };
    onSave(payload);
  };

  const isAutoHalaqah =
    !selectedSantri?.id_santri && selectedSantri?.id_halaqah;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-106.25">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {selectedSantri ? "Edit Data Santri" : "Tambah Santri Baru"}
            </DialogTitle>
            <DialogDescription>
              Isi data santri di bawah ini dengan benar.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nama_santri">Nama Lengkap *</Label>
              <Input
                id="nama_santri"
                name="nama_santri"
                defaultValue={selectedSantri?.nama_santri || ""}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nomor_telepon">Nomor Telepon *</Label>
              <Input
                id="nomor_telepon"
                name="nomor_telepon"
                defaultValue={selectedSantri?.nomor_telepon || ""}
                required
                type="tel"
              />
            </div>

            {isAdmin && !isAutoHalaqah && (
              <div className="grid gap-2">
                <Label htmlFor="id_halaqah">Pilih Halaqah</Label>
                <Select value={halaqahId} onValueChange={setHalaqahId}>
                  {/* ... Select Content ... */}
                </Select>
              </div>
            )}

            {/* Jika auto-halaqah, tampilkan info saja (Opsional) */}
            {isAutoHalaqah && (
              <div className="bg-muted/50 p-3 rounded-md border border-dashed">
                <p className="text-[10px] uppercase text-muted-foreground font-bold">
                  Halaqah Tujuan
                </p>
                <p className="text-sm font-semibold">
                  {
                    halaqahList.find(
                      (h) => h.id_halaqah.toString() === halaqahId,
                    )?.name_halaqah
                  }
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
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
