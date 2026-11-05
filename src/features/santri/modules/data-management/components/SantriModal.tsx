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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, User, Users, History } from "lucide-react";
import { type Santri, type StatusSantri, STATUS_SANTRI_LABELS } from "@/features/santri/types";
import { type Halaqah } from "@/features/halaqah/api/halaqahService";
import { useTargetList } from "@/features/settings";
import { TIPE_TARGET_LABELS, SATUAN_TARGET_LABELS, type TargetSekolah } from "@/types/domain/target";
import { Term } from "@/components/ui/Term";
import { useTerminology } from "@/hooks/useTerminology";
import { SantriWaliSection } from "../../../components/SantriWaliSection";
import { RiwayatHalaqahSection } from "../../../components/RiwayatHalaqahSection";

interface SantriModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    nama_santri: string;
    nomor_induk_santri?: string | null;
    status?: StatusSantri;
    nomor_telepon?: string | null;
    id_target: number | null;
    id_halaqah: number | undefined;
  }) => void;
  selectedSantri: Partial<Santri> | null;
  isAdmin: boolean;
  halaqahList: Halaqah[];
  isSubmitting: boolean;
  onPindahHalaqahClick?: (santri: Santri) => void;
}

export function SantriModal({
  isOpen,
  onClose,
  onSave,
  selectedSantri,
  isSubmitting,
  isAdmin,
  halaqahList,
  onPindahHalaqahClick,
}: SantriModalProps) {
  const [halaqahId, setHalaqahId] = useState<string>("");
  const [targetId, setTargetId] = useState<string>("__none__");
  const [namaSantri, setNamaSantri] = useState("");
  const [nomorIndukSantri, setNomorIndukSantri] = useState("");
  const [status, setStatus] = useState<StatusSantri>("AKTIF");
  const [nomorTelepon, setNomorTelepon] = useState("");

  const { data: targetList = [] as TargetSekolah[], isLoading: isLoadingTargets } = useTargetList();
  const labelSantri = useTerminology("SANTRI");

  // Reset form saat modal dibuka atau santri berubah
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setNamaSantri(selectedSantri?.nama_santri ?? "");
        setNomorIndukSantri(selectedSantri?.nomor_induk_santri ?? "");
        setStatus(selectedSantri?.status ?? "AKTIF");
        setNomorTelepon(selectedSantri?.nomor_telepon ?? "");
        setHalaqahId(selectedSantri?.id_halaqah?.toString() ?? "");
        const existingTarget = selectedSantri?.id_target;
        setTargetId(existingTarget ? existingTarget.toString() : "__none__");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, selectedSantri]);

  const handleGenerateNIS = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setNomorIndukSantri(`NIS-${year}-${randomNum}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedTargetId = targetId === "__none__" ? null : parseInt(targetId, 10);
    const parsedHalaqahId = halaqahId ? parseInt(halaqahId, 10) : undefined;

    onSave({
      nama_santri: namaSantri,
      nomor_induk_santri: nomorIndukSantri.trim() || null,
      status,
      nomor_telepon: nomorTelepon,
      id_target: parsedTargetId,
      id_halaqah: parsedHalaqahId,
    });
  };

  const isAutoHalaqah = !selectedSantri?.id_santri && selectedSantri?.id_halaqah;
  const isEditing = !!selectedSantri?.id_santri;

  const selectedTarget = targetList.find(
    (t) => t.id_target.toString() === targetId
  );

  const formFields = (
    <form onSubmit={handleSubmit}>
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

        {/* Nomor Induk Santri (NIS) & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="nomor_induk_santri">
                Nomor Induk Santri (NIS)
                <span className="ml-1 text-xs text-muted-foreground font-normal">(opsional)</span>
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleGenerateNIS}
                className="h-6 px-1.5 text-xs text-primary hover:text-primary gap-1"
                title="Generate NIS otomatis"
              >
                <Sparkles className="h-3 w-3" />
                Auto
              </Button>
            </div>
            <Input
              id="nomor_induk_santri"
              name="nomor_induk_santri"
              value={nomorIndukSantri}
              onChange={(e) => setNomorIndukSantri(e.target.value)}
              placeholder="Contoh: NIS-2026-001"
              className="font-mono"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status Santri</Label>
            <Select value={status} onValueChange={(val: StatusSantri) => setStatus(val)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AKTIF">{STATUS_SANTRI_LABELS.AKTIF}</SelectItem>
                <SelectItem value="LULUS">{STATUS_SANTRI_LABELS.LULUS}</SelectItem>
                <SelectItem value="KELUAR">{STATUS_SANTRI_LABELS.KELUAR}</SelectItem>
                <SelectItem value="CUTI">{STATUS_SANTRI_LABELS.CUTI}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Nomor Telepon */}
        <div className="grid gap-2">
          <Label htmlFor="nomor_telepon">
            Nomor Telepon
            <span className="ml-1 text-xs text-muted-foreground font-normal">(opsional)</span>
          </Label>
          <Input
            id="nomor_telepon"
            name="nomor_telepon"
            value={nomorTelepon}
            onChange={(e) => setNomorTelepon(e.target.value)}
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
            <Label htmlFor="id_halaqah">Pilih <Term code="HALAQAH" /></Label>
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
              <Term code="HALAQAH" /> Tujuan
            </p>
            <p className="text-sm font-semibold">
              {halaqahList.find(
                (h) => h.id_halaqah.toString() === halaqahId
              )?.name_halaqah ?? <><Term code="HALAQAH" /> saat ini</>}
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
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={isEditing ? "sm:max-w-2xl max-h-[90vh] overflow-y-auto" : "sm:max-w-md"}>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? <>Edit Data <Term code="SANTRI" /></> : <>Tambah <Term code="SANTRI" /> Baru</>}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Kelola informasi profil, wali, dan riwayat ${labelSantri.toLowerCase()}.`
              : <>Isi data <Term code="SANTRI" /> di bawah ini. Target setoran bersifat opsional.</>}
          </DialogDescription>
        </DialogHeader>

        {isEditing && selectedSantri?.id_santri ? (
          <Tabs defaultValue="profil" className="w-full mt-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profil" className="gap-1.5 text-xs">
                <User className="h-3.5 w-3.5" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="wali" className="gap-1.5 text-xs">
                <Users className="h-3.5 w-3.5" />
                Wali
              </TabsTrigger>
              <TabsTrigger value="riwayat" className="gap-1.5 text-xs">
                <History className="h-3.5 w-3.5" />
                Riwayat <Term code="HALAQAH" />
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profil" className="pt-2">
              {formFields}
            </TabsContent>
            <TabsContent value="wali" className="pt-2">
              <SantriWaliSection
                santriId={selectedSantri.id_santri}
                santriName={selectedSantri.nama_santri}
              />
            </TabsContent>
            <TabsContent value="riwayat" className="pt-2">
              <RiwayatHalaqahSection
                santriId={selectedSantri.id_santri}
                santriName={selectedSantri.nama_santri}
                onPindahHalaqahClick={
                  onPindahHalaqahClick
                    ? () => onPindahHalaqahClick(selectedSantri as Santri)
                    : undefined
                }
              />
            </TabsContent>
          </Tabs>
        ) : (
          formFields
        )}
      </DialogContent>
    </Dialog>
  );
}
