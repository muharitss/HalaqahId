import { useState } from "react";
import { muhafizService } from "../services/muhafizService";
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
import { getErrorMessage } from "@/utils/error";
import type { DeleteAkunProps } from "../types";

export function DeleteAkun({ muhafiz, isOpen, onClose, onSuccess }: DeleteAkunProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    setConfirmText("");
    setError("");
    onClose();
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!muhafiz || confirmText !== "hapus") return;

    setIsLoading(true);
    setError("");

    try {
      const response = await muhafizService.deleteMuhafiz(muhafiz.id_user);
      if (response.success) {
        toast.success("Akun muhafidz berhasil dihapus secara permanen");
        onSuccess();
        handleClose();
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Gagal menghapus data dari server"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="sm:max-w-106.25">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <FontAwesomeIcon icon={faTriangleExclamation} />
            Konfirmasi Hapus Akun
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-sm space-y-3 pt-2">
              <p>
                Tindakan ini akan menghapus akun secara permanen. Pengguna tidak akan bisa lagi mengakses sistem dengan email ini.
              </p>
              
              <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3">
                <p className="font-bold text-destructive">{muhafiz?.username}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Email: {muhafiz?.email}
                </p>
                <p className="text-[10px] font-mono mt-1 opacity-70 italic">
                  ID Akun: #{muhafiz?.id_user}
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
          <Label htmlFor="confirm-delete" className="text-xs">
            Ketik <span className="font-bold text-destructive">hapus</span> untuk melanjutkan
          </Label>
          <Input
            id="confirm-delete"
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
            className="min-w-25"
          >
            {isLoading ? (
              <FontAwesomeIcon icon={faCircleNotch} className="animate-spin mr-2" />
            ) : (
              <FontAwesomeIcon icon={faTrash} className="mr-2 h-3 w-3" />
            )}
            Hapus Akun
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}