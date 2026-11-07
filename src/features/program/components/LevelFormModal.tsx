import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { LevelHafalan, CreateLevelPayload, UpdateLevelPayload } from "../types";

interface LevelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateLevelPayload | UpdateLevelPayload) => Promise<void>;
  initialData?: LevelHafalan | null;
  defaultUrutan?: number;
  isLoading?: boolean;
}

interface LevelFormContentProps {
  initialData?: LevelHafalan | null;
  defaultUrutan: number;
  onClose: () => void;
  onSubmit: (payload: CreateLevelPayload | UpdateLevelPayload) => Promise<void>;
  isLoading: boolean;
}

const LevelFormContent: React.FC<LevelFormContentProps> = ({
  initialData,
  defaultUrutan,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [namaLevel, setNamaLevel] = useState(initialData?.nama_level || "");
  const [urutan] = useState<number>(initialData?.urutan || defaultUrutan);
  const [targetJuzMin, setTargetJuzMin] = useState<string>(
    initialData?.target_juz_min != null ? String(initialData.target_juz_min) : ""
  );
  const [targetJuzMax, setTargetJuzMax] = useState<string>(
    initialData?.target_juz_max != null ? String(initialData.target_juz_max) : ""
  );
  const [keterangan, setKeterangan] = useState(initialData?.keterangan || "");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!namaLevel.trim()) {
      setErrorMsg("Nama level wajib diisi.");
      return;
    }

    const minJuz = targetJuzMin.trim() !== "" ? parseInt(targetJuzMin, 10) : null;
    const maxJuz = targetJuzMax.trim() !== "" ? parseInt(targetJuzMax, 10) : null;

    if (minJuz !== null && (isNaN(minJuz) || minJuz < 1 || minJuz > 30)) {
      setErrorMsg("Target juz minimal harus antara 1 sampai 30.");
      return;
    }

    if (maxJuz !== null && (isNaN(maxJuz) || maxJuz < 1 || maxJuz > 30)) {
      setErrorMsg("Target juz maksimal harus antara 1 sampai 30.");
      return;
    }

    if (minJuz !== null && maxJuz !== null && minJuz > maxJuz) {
      setErrorMsg("Target juz minimal tidak boleh lebih besar dari target juz maksimal.");
      return;
    }

    await onSubmit({
      nama_level: namaLevel.trim(),
      urutan: Number(urutan) || 1,
      target_juz_min: minJuz,
      target_juz_max: maxJuz,
      keterangan: keterangan.trim() ? keterangan.trim() : null,
    });
    onClose();
  };

  const isEdit = !!initialData;

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {isEdit ? "Edit Level Hafalan" : "Tambah Level Hafalan"}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-4">
        {errorMsg && (
          <div className="p-3 text-sm rounded bg-destructive/10 text-destructive border border-destructive/20">
            {errorMsg}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="nama_level">
            Nama Level <span className="text-destructive">*</span>
          </Label>
          <Input
            id="nama_level"
            placeholder="Contoh: Level 1 - Juz 30"
            value={namaLevel}
            onChange={(e) => setNamaLevel(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="target_juz_min">Target Juz Min</Label>
            <Input
              id="target_juz_min"
              type="number"
              min={1}
              max={30}
              placeholder="Contoh: 30"
              value={targetJuzMin}
              onChange={(e) => setTargetJuzMin(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Antara 1 - 30</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_juz_max">Target Juz Max</Label>
            <Input
              id="target_juz_max"
              type="number"
              min={1}
              max={30}
              placeholder="Contoh: 30"
              value={targetJuzMax}
              onChange={(e) => setTargetJuzMax(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Antara 1 - 30</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="keterangan">Keterangan (Opsional)</Label>
          <Textarea
            id="keterangan"
            placeholder="Catatan atau capaian hafalan untuk level ini..."
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            rows={2}
          />
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button type="submit" disabled={isLoading || !namaLevel.trim()}>
          {isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Level"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export const LevelFormModal: React.FC<LevelFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  defaultUrutan = 1,
  isLoading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {isOpen && (
          <LevelFormContent
            key={initialData?.id_level ? `edit-${initialData.id_level}` : `create-${defaultUrutan}`}
            initialData={initialData}
            defaultUrutan={defaultUrutan}
            onClose={onClose}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
