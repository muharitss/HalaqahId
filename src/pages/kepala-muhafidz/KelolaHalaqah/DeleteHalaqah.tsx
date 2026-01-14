import { useState } from "react";
import { halaqahService, type Halaqah } from "@/services/halaqahService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faTriangleExclamation, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

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

  const handleClose = () => {
    setConfirmText("");
    setError("");
    onClose();
  };

  const handleDelete = async (e: React.MouseEvent) => {
    // Mencegah AlertDialog menutup otomatis jika validasi gagal
    e.preventDefault();
    if (!halaqah || confirmText !== "hapus") return;

    setIsLoading(true);
    setError("");

    try {
      const response = await halaqahService.deleteHalaqah(halaqah.id_halaqah);
      if (response.success) {
        toast.success("Halaqah berhasil dihapus secara permanen");
        onSuccess();
        handleClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menghapus data dari server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <FontAwesomeIcon icon={faTriangleExclamation} />
            Konfirmasi Hapus
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-sm space-y-3 pt-2">
              <p>
                Tindakan ini akan menghapus halaqah secara permanen. Data santri di dalamnya mungkin akan kehilangan pengampu.
              </p>
              
              <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3">
                <p className="font-bold text-destructive">{halaqah?.name_halaqah}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Muhafidz: {halaqah?.muhafiz.username}
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <Alert variant="destructive" className="py-2">
            <AlertDescription className="text-xs">{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3 py-2">
          <Label htmlFor="confirm" className="text-xs">
            Ketik <span className="font-bold uppercase tracking-widest text-destructive">hapus</span> untuk melanjutkan
          </Label>
          <Input
            id="confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="hapus"
            autoComplete="off"
            className="h-9 focus-visible:ring-destructive"
            disabled={isLoading}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose} disabled={isLoading}>
            Batal
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={confirmText !== "hapus" || isLoading}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <FontAwesomeIcon icon={faCircleNotch} className="animate-spin mr-2" />
            ) : (
              <FontAwesomeIcon icon={faTrash} className="mr-2 h-3 w-3" />
            )}
            Hapus Data
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}