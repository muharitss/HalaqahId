import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { getErrorMessage } from "@/utils/error";

// Import types langsung dari feature
import { type Santri } from "@/features/muhafidz/kelola-santri/types";
import { type Halaqah } from "@/features/kepala-muhafidz/kelola-halaqah/types";

interface PindahSantriProps {
  isOpen: boolean;
  onClose: () => void;
  santri: Santri | null;
  halaqahs: Halaqah[];
  onConfirm: (santriId: number, targetHalaqahId: number) => Promise<void>;
}

export function PindahSantri({
  isOpen,
  onClose,
  santri,
  halaqahs,
  onConfirm,
}: PindahSantriProps) {
  const [targetHalaqahId, setTargetHalaqahId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (!santri || !targetHalaqahId) return;

    setIsLoading(true);
    setError("");

    try {
      await onConfirm(santri.id_santri, parseInt(targetHalaqahId));
      handleClose();
    } catch (err) {
      setError(getErrorMessage(err, "Gagal memindahkan santri"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTargetHalaqahId("");
    setError("");
    onClose();
  };

  const filteredHalaqahs = halaqahs.filter(
    (h) => h.id_halaqah !== santri?.halaqah_id
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pindah Halaqah Santri</DialogTitle>
          <DialogDescription>
            Pilih halaqah baru untuk <span className="font-bold">{santri?.nama_santri}</span>
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Halaqah Tujuan</Label>
            <Select
              value={targetHalaqahId}
              onValueChange={setTargetHalaqahId}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih halaqah" />
              </SelectTrigger>
              <SelectContent>
                {filteredHalaqahs.map((h) => (
                  <SelectItem key={h.id_halaqah} value={h.id_halaqah.toString()}>
                    {h.name_halaqah}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Batal
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!targetHalaqahId || isLoading}
          >
            {isLoading ? (
              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
            ) : (
              <FontAwesomeIcon icon={faArrowRight} className="mr-2" />
            )}
            Pindahkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}