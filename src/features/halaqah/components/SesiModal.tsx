import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { SesiHalaqah, CreateSesiHalaqahRequest, UpdateSesiHalaqahRequest } from "@/types/domain/sesi-halaqah";
import type { Halaqah } from "@/features/halaqah/types";

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
  const [idHalaqahs, setIdHalaqahs] = useState<string[]>([]);
  const [hari, setHari] = useState<number[]>([]);

  const HARI_OPTIONS = [
    { value: 1, label: "Senin" },
    { value: 2, label: "Selasa" },
    { value: 3, label: "Rabu" },
    { value: 4, label: "Kamis" },
    { value: 5, label: "Jumat" },
    { value: 6, label: "Sabtu" },
    { value: 7, label: "Ahad" },
  ];

  useEffect(() => {
    if (isOpen) {
      if (sesi) {
        setNamaSesi(sesi.nama_sesi || "");
        setJamMulai(sesi.jam_mulai || "");
        setJamSelesai(sesi.jam_selesai || "");
        setIdHalaqahs(sesi.halaqahs ? sesi.halaqahs.map(h => h.id_halaqah.toString()) : []);
        setHari(sesi.hari || []);
      } else {
        setNamaSesi("");
        setJamMulai("");
        setJamSelesai("");
        setIdHalaqahs([]);
        setHari([]);
      }
    }
  }, [isOpen, sesi]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!sesi;
    
    let payload;
    if (isEdit) {
      if (idHalaqahs.length === 0) {
        alert("Pilih minimal satu halaqah");
        return;
      }
      payload = {
        nama_sesi: namaSesi,
        jam_mulai: jamMulai,
        jam_selesai: jamSelesai,
        hari: hari.length > 0 ? hari : undefined,
        id_halaqahs: idHalaqahs.map(Number),
      } as UpdateSesiHalaqahRequest;
    } else {
      if (idHalaqahs.length === 0) {
        alert("Pilih minimal satu halaqah");
        return;
      }
      
      payload = {
        nama_sesi: namaSesi,
        jam_mulai: jamMulai,
        jam_selesai: jamSelesai,
        hari: hari.length > 0 ? hari : undefined,
        id_halaqahs: idHalaqahs.map(Number),
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

          <div className="space-y-2">
            <Label>Hari (Opsional)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border rounded-md p-3">
              {HARI_OPTIONS.map((h) => (
                <div key={h.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`hari-${h.value}`} 
                    checked={hari.includes(h.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setHari([...hari, h.value]);
                      } else {
                        setHari(hari.filter(id => id !== h.value));
                      }
                    }}
                  />
                  <Label htmlFor={`hari-${h.value}`} className="font-normal cursor-pointer text-sm">
                    {h.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Halaqah <span className="text-red-500">*</span></Label>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="all-halaqah" 
                  checked={idHalaqahs.length === halaqahList.length && halaqahList.length > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setIdHalaqahs(halaqahList.map(h => h.id_halaqah.toString()));
                    } else {
                      setIdHalaqahs([]);
                    }
                  }}
                />
                <Label htmlFor="all-halaqah" className="text-sm font-normal cursor-pointer text-muted-foreground">Pilih Semua</Label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-md p-3 max-h-40 overflow-y-auto">
              {halaqahList.map((h) => (
                <div key={h.id_halaqah} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`halaqah-${h.id_halaqah}`} 
                    checked={idHalaqahs.includes(h.id_halaqah.toString())}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setIdHalaqahs([...idHalaqahs, h.id_halaqah.toString()]);
                      } else {
                        setIdHalaqahs(idHalaqahs.filter(id => id !== h.id_halaqah.toString()));
                      }
                    }}
                  />
                  <Label htmlFor={`halaqah-${h.id_halaqah}`} className="font-normal cursor-pointer text-sm truncate">
                    {h.name_halaqah}
                  </Label>
                </div>
              ))}
              {halaqahList.length === 0 && (
                <div className="col-span-full text-sm text-muted-foreground italic">
                  Tidak ada data halaqah tersedia.
                </div>
              )}
            </div>
          </div>

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
