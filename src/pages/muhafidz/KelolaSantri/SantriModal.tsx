"use client";

import React, { useState, useEffect } from "react"; // Perbaikan: Import Hooks
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

interface SantriModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  selectedSantri: any;
  isAdmin: boolean;
  halaqahList: any[];
  isSubmitting: boolean;
}

export function SantriModal({
  isOpen,
  onClose,
  onSave,
  selectedSantri,
  isAdmin,
  halaqahList,
  isSubmitting,
}: SantriModalProps) {
  // Sekarang useState sudah terdefinisi karena sudah di-import
  const [target, setTarget] = useState<string>("SEDANG");
  const [halaqahId, setHalaqahId] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setTarget(selectedSantri?.target || "SEDANG");
      setHalaqahId(selectedSantri?.halaqah_id?.toString() || "");
    }
  }, [isOpen, selectedSantri]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      nama_santri: formData.get("nama_santri"),
      nomor_telepon: formData.get("nomor_telepon"),
      target: target,
      // Jika kosong, berikan undefined agar sesuai dengan tipe data UpdateSantriData
      halaqah_id: halaqahId ? parseInt(halaqahId, 10) : undefined,
    };

    onSave(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
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

            <div className="grid gap-2">
              <Label htmlFor="target">Target Hafalan *</Label>
              <Select value={target} onValueChange={setTarget}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RINGAN">Ringan</SelectItem>
                  <SelectItem value="SEDANG">Sedang</SelectItem>
                  <SelectItem value="INTENSE">Intens</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isAdmin && (
              <div className="grid gap-2">
                <Label htmlFor="halaqah_id">Halaqah *</Label>
                <Select value={halaqahId} onValueChange={setHalaqahId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih halaqah" />
                  </SelectTrigger>
                  <SelectContent>
                    {halaqahList?.map((h: any) => (
                      <SelectItem key={h.id_halaqah} value={h.id_halaqah.toString()}>
                        {h.name_halaqah}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
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