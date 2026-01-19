import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { type Santri } from "@/services/santriService";
import { type Halaqah } from "@/services/halaqahService";
import { ArrowRightLeft, Loader2 } from "lucide-react";

interface PindahSantriProps {
  santri: Santri | null;
  halaqahs: Halaqah[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (santriId: number, targetHalaqahId: number) => Promise<void>;
}

export function PindahSantri({
  santri,
  halaqahs,
  isOpen,
  onClose,
  onConfirm,
}: PindahSantriProps) {
  const [targetId, setTargetId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!santri || !targetId) return;
    setIsSubmitting(true);
    try {
      await onConfirm(santri.id_santri, parseInt(targetId));
      onClose();
    } finally {
      setIsSubmitting(false);
      setTargetId("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-blue-500" />
            Pindah Halaqah
          </DialogTitle>
          <DialogDescription>
            Pindahkan <strong>{santri?.nama_santri}</strong> ke kelompok halaqah yang berbeda.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Pilih Halaqah Tujuan</Label>
            <Select onValueChange={setTargetId} value={targetId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih halaqah baru..." />
              </SelectTrigger>
              <SelectContent>
                {halaqahs
                  .filter((h) => h.id_halaqah !== santri?.halaqah_id)
                  .map((h) => (
                    <SelectItem key={h.id_halaqah} value={h.id_halaqah.toString()}>
                      {h.name_halaqah} ({h.muhafiz?.username})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={!targetId || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Pindahkan Santri
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}