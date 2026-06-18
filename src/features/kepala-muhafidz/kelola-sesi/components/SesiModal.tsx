import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SesiHalaqah, CreateSesiHalaqahRequest, UpdateSesiHalaqahRequest } from "@/types/domain/sesi-halaqah";
import type { Halaqah } from "../../kelola-halaqah/types";

interface SesiModalProps {
  isOpen: boolean;
  onClose: () => void;
  sesi: SesiHalaqah | null;
  halaqahList: Halaqah[];
  onSave: (payload: any) => Promise<boolean>;
  isSubmitting: boolean;
}

export function SesiModal({ isOpen, onClose, sesi, halaqahList, onSave, isSubmitting }: SesiModalProps) {
  const [namaSesi, setNamaSesi] = useState("");
  const [jamMulai, setJamMulai] = useState("");
  const [jamSelesai, setJamSelesai] = useState("");
  const [idHalaqah, setIdHalaqah] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      if (sesi) {
        setNamaSesi(sesi.nama_sesi || "");
        setJamMulai(sesi.jam_mulai || "");
        setJamSelesai(sesi.jam_selesai || "");
        setIdHalaqah(sesi.id_halaqah ? sesi.id_halaqah.toString() : "");
      } else {
        setNamaSesi("");
        setJamMulai("");
        setJamSelesai("");
        setIdHalaqah("");
      }
    }
  }, [isOpen, sesi]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!sesi;
    
    let payload;
    if (isEdit) {
      payload = {
        nama_sesi: namaSesi,
        jam_mulai: jamMulai,
        jam_selesai: jamSelesai,
      } as UpdateSesiHalaqahRequest;
    } else {
      payload = {
        nama_sesi: namaSesi,
        jam_mulai: jamMulai,
        jam_selesai: jamSelesai,
        id_halaqah: idHalaqah ? parseInt(idHalaqah) : undefined,
      } as CreateSesiHalaqahRequest;
    }

    const success = await onSave(payload);
    if (success) {
      onClose();
    }
  };

  const isEdit = !!sesi;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Sesi Halaqah" : "Tambah Sesi Halaqah"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama_sesi">Nama Sesi <span className="text-red-500">*</span></Label>
            <Input 
              id="nama_sesi" 
              value={namaSesi} 
              onChange={(e) => setNamaSesi(e.target.value)} 
              placeholder="Contoh: Bada Subuh" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jam_mulai">Jam Mulai <span className="text-red-500">*</span></Label>
              <Input 
                id="jam_mulai" 
                type="time" 
                value={jamMulai} 
                onChange={(e) => setJamMulai(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jam_selesai">Jam Selesai <span className="text-red-500">*</span></Label>
              <Input 
                id="jam_selesai" 
                type="time" 
                value={jamSelesai} 
                onChange={(e) => setJamSelesai(e.target.value)} 
                required 
              />
            </div>
          </div>

          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="id_halaqah">Halaqah <span className="text-red-500">*</span></Label>
              <Select value={idHalaqah} onValueChange={setIdHalaqah} required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Halaqah" />
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

          <DialogFooter className="pt-4">
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
