import { useState } from "react";
import { akunService, type Muhafiz } from "@/services/akunService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface DeleteConfirmationProps {
  muhafiz: Muhafiz | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteAkun({ muhafiz, isOpen, onClose, onSuccess }: DeleteConfirmationProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!muhafiz || confirmText !== "hapus") return;

    setIsLoading(true);
    setError("");

    try {
      const response = await akunService.deleteMuhafiz(muhafiz.id_user);
      
      if (response.success) {
        onSuccess();
        handleClose();
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Gagal menghapus muhafidz";
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
            Hapus Muhafidz?
          </DialogTitle>
          <DialogDescription>
            <div className="space-y-3">
              <p>Apakah Anda yakin ingin menghapus muhafidz ini?</p>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="font-semibold text-destructive">{muhafiz?.username}</p>
                <p className="text-sm text-destructive/80">{muhafiz?.email}</p>
                <p className="text-xs mt-2">ID: #{muhafiz?.id_user}</p>
              </div>
              <p className="text-sm text-destructive">
                <strong>PERINGATAN:</strong> Tindakan ini tidak dapat dibatalkan.
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