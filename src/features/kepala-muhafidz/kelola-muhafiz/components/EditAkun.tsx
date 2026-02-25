import { useState, useEffect } from "react";
import { muhafizService } from "../services/muhafizService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { getErrorMessage } from "@/utils/error";
import type { EditAkunProps } from "../types";

export function EditAkun({ muhafiz, isOpen, onClose, onSuccess }: EditAkunProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (muhafiz) {
      setFormData({
        username: muhafiz.username || "",
        email: muhafiz.email
      });
    }
  }, [muhafiz]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!muhafiz) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await muhafizService.updateMuhafiz(muhafiz.id_user, formData);
      
      if (response.success) {
        setSuccess("Data muhafidz berhasil diperbarui!");
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1000);
      }
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Gagal memperbarui data");
      setError(message);
      console.error("Edit error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ username: "", email: "" });
    setError("");
    setSuccess("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FontAwesomeIcon icon={faEdit} />
            Edit Data Muhafidz
          </DialogTitle>
          <DialogDescription>
            Edit informasi muhafidz #{muhafiz?.id_user}
          </DialogDescription>
        </DialogHeader>

        {success && (
          <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
            <FontAwesomeIcon icon={faCheck} className="mr-2" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <FontAwesomeIcon icon={faXmark} className="mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              placeholder="Masukkan username"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Masukkan email"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Perhatian:</strong> Pastikan email belum digunakan oleh akun lain.
            </p>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.username.trim() || !formData.email.trim()}
            >
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}