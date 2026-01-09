import { useState } from "react";
import { halaqahService, type Halaqah } from "@/services/halaqahService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface DeleteHalaqahProps {
  halaqah: Halaqah | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteHalaqah({ halaqah, isOpen, onClose, onSuccess }: DeleteHalaqahProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!halaqah || confirmText !== "hapus") return;

    setIsLoading(true);
    setError("");

    try {
      const response = await halaqahService.deleteHalaqah(halaqah.id_halaqah);
      
      if (response.success) {
        onSuccess();
        handleClose();
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Gagal menghapus halaqah";
      setError(message);
      console.error("Delete error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmText("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <FontAwesomeIcon icon={faTrash} />
            Hapus Halaqah?
          </DialogTitle>
          <DialogDescription>
            <div className="space-y-3">
              <p>Apakah Anda yakin ingin menghapus halaqah ini?</p>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="font-semibold text-destructive">{halaqah?.nama_halaqah}</p>
                <p className="text-sm text-destructive/80">Jenis: {halaqah?.jenis}</p>
                <p className="text-sm text-destructive/80">Muhafidz: {halaqah?.muhafidz.username}</p>
                <p className="text-xs mt-2">ID: #{halaqah?.id_halaqah}</p>
              </div>
              <p className="text-sm text-destructive">
                <strong>PERINGATAN:</strong> Hapus halaqah juga akan menghapus semua santri di dalamnya!
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <FontAwesomeIcon icon={faXmark} className="mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirm-delete">
              Ketik <span className="font-bold text-destructive">"hapus"</span> untuk konfirmasi
            </Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Ketik 'hapus'"
              className={confirmText && confirmText !== "hapus" ? "border-destructive" : ""}
              disabled={isLoading}
            />
            {confirmText && confirmText !== "hapus" && (
              <p className="text-sm text-destructive">Kata konfirmasi tidak sesuai</p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={confirmText !== "hapus" || isLoading}
            className="gap-2"
          >
            <FontAwesomeIcon icon={faTrash} />
            {isLoading ? "Menghapus..." : "Hapus Permanent"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}