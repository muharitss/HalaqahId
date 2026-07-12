import { useState } from "react";
import { Pencil, X, Check, User, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthUser } from "@/types/domain/auth";
import type { ProfilFormValues } from "../types";

interface EditProfilFormProps {
  user: AuthUser;
  isEditing: boolean;
  isSubmitting: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (values: ProfilFormValues) => void;
}

export function EditProfilForm({
  user,
  isEditing,
  isSubmitting,
  onEdit,
  onCancel,
  onSave,
}: EditProfilFormProps) {
  const [name, setName] = useState(user.name);
  const [nomorTelepon, setNomorTelepon] = useState(user.nomor_telepon ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) return;
    onSave({ name: name.trim(), nomor_telepon: nomorTelepon.trim() });
  };

  // Reset form ketika mulai edit
  const handleEdit = () => {
    setName(user.name);
    setNomorTelepon(user.nomor_telepon ?? "");
    onEdit();
  };

  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/20">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">Informasi Pribadi</h3>
        </div>
        {!isEditing ? (
          <Button variant="ghost" size="sm" onClick={handleEdit} className="gap-1.5 text-xs h-8">
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
            className="gap-1.5 text-xs h-8 text-muted-foreground"
          >
            <X className="h-3.5 w-3.5" />
            Batal
          </Button>
        )}
      </div>

      {/* Card Body */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Nama */}
        <div className="space-y-1.5">
          <Label htmlFor="profil-name" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Nama Lengkap
          </Label>
          {isEditing ? (
            <Input
              id="profil-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap"
              minLength={2}
              required
              className="h-10"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-muted/30 text-sm">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="font-medium">{user.name}</span>
            </div>
          )}
        </div>

        {/* Email - selalu read-only */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Email
          </Label>
          <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-muted/30 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">{user.email}</span>
            <span className="ml-auto text-[10px] text-muted-foreground/60 bg-muted rounded px-1.5 py-0.5">
              Tidak dapat diubah
            </span>
          </div>
        </div>

        {/* Nomor Telepon */}
        <div className="space-y-1.5">
          <Label htmlFor="profil-telepon" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Nomor Telepon
          </Label>
          {isEditing ? (
            <Input
              id="profil-telepon"
              value={nomorTelepon}
              onChange={(e) => setNomorTelepon(e.target.value)}
              placeholder="Contoh: 08123456789"
              type="tel"
              className="h-10"
            />
          ) : (
            <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-muted/30 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className={user.nomor_telepon ? "font-medium" : "text-muted-foreground italic"}>
                {user.nomor_telepon ?? "Belum diisi"}
              </span>
            </div>
          )}
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || !name.trim() || name.trim().length < 2}
              className="gap-2 h-9 px-6"
            >
              <Check className="h-3.5 w-3.5" />
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
