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
import type { ProgramTahfidz, CreateProgramPayload, UpdateProgramPayload } from "../types";

interface ProgramFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateProgramPayload | UpdateProgramPayload) => Promise<void>;
  initialData?: ProgramTahfidz | null;
  isLoading?: boolean;
}

interface ProgramFormContentProps {
  initialData?: ProgramTahfidz | null;
  onClose: () => void;
  onSubmit: (payload: CreateProgramPayload | UpdateProgramPayload) => Promise<void>;
  isLoading: boolean;
}

const ProgramFormContent: React.FC<ProgramFormContentProps> = ({
  initialData,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [namaProgram, setNamaProgram] = useState(initialData?.nama_program || "");
  const [deskripsi, setDeskripsi] = useState(initialData?.deskripsi || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaProgram.trim()) return;

    await onSubmit({
      nama_program: namaProgram.trim(),
      deskripsi: deskripsi.trim() ? deskripsi.trim() : null,
    });
    onClose();
  };

  const isEdit = !!initialData;

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {isEdit ? "Edit Program Tahfidz" : "Tambah Program Tahfidz"}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="nama_program">
            Nama Program <span className="text-destructive">*</span>
          </Label>
          <Input
            id="nama_program"
            placeholder="Contoh: Program Tahfidz Reguler"
            value={namaProgram}
            onChange={(e) => setNamaProgram(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deskripsi">Deskripsi</Label>
          <Textarea
            id="deskripsi"
            placeholder="Penjelasan singkat mengenai program tahfidz ini..."
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            rows={3}
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
        <Button type="submit" disabled={isLoading || !namaProgram.trim()}>
          {isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Program"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export const ProgramFormModal: React.FC<ProgramFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {isOpen && (
          <ProgramFormContent
            key={initialData?.id_program ? `edit-${initialData.id_program}` : "create"}
            initialData={initialData}
            onClose={onClose}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
