import { User, Mail, Phone, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PersonalProfileFieldsProps {
  email: string;
  isEditing: boolean;
  name: string;
  onNameChange: (value: string) => void;
  initialName: string;
  nomorTelepon: string;
  onNomorTeleponChange: (value: string) => void;
  initialPhone: string;
  bio: string;
  onBioChange: (value: string) => void;
  initialBio: string;
}

export function PersonalProfileFields({
  email,
  isEditing,
  name,
  onNameChange,
  initialName,
  nomorTelepon,
  onNomorTeleponChange,
  initialPhone,
  bio,
  onBioChange,
  initialBio,
}: PersonalProfileFieldsProps) {
  return (
    <div className="space-y-5">
      {/* Nama Lengkap */}
      <div className="space-y-1.5">
        <Label
          htmlFor="profil-nama-lengkap"
          className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5"
        >
          <User className="h-3.5 w-3.5" />
          Nama Lengkap
        </Label>
        {isEditing ? (
          <Input
            id="profil-nama-lengkap"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Masukkan nama lengkap Anda"
            minLength={2}
            required
            className="h-10"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-muted/30 text-sm">
            <span className="font-medium text-foreground">
              {initialName || "-"}
            </span>
          </div>
        )}
      </div>

      {/* Email (Read-Only) */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
          <Mail className="h-3.5 w-3.5" />
          Email
        </Label>
        <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 text-sm">
          <span className="text-muted-foreground">{email}</span>
          <span className="text-[10px] font-medium text-muted-foreground/70 bg-muted px-2 py-0.5 rounded">
            Tidak dapat diubah
          </span>
        </div>
      </div>

      {/* Nomor Telepon */}
      <div className="space-y-1.5">
        <Label
          htmlFor="profil-telepon"
          className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5"
        >
          <Phone className="h-3.5 w-3.5" />
          Nomor Telepon / WhatsApp
        </Label>
        {isEditing ? (
          <Input
            id="profil-telepon"
            value={nomorTelepon}
            onChange={(e) => onNomorTeleponChange(e.target.value)}
            placeholder="Contoh: 08123456789"
            type="tel"
            className="h-10"
          />
        ) : (
          <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-muted/30 text-sm">
            <span className={initialPhone ? "font-medium" : "text-muted-foreground italic"}>
              {initialPhone || "Belum diisi"}
            </span>
          </div>
        )}
      </div>

      {/* Bio / Catatan */}
      <div className="space-y-1.5">
        <Label
          htmlFor="profil-bio"
          className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5"
        >
          <FileText className="h-3.5 w-3.5" />
          Bio / Catatan Pribadi
        </Label>
        {isEditing ? (
          <Textarea
            id="profil-bio"
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
            placeholder="Tuliskan bio singkat atau visi dakwah Al-Qur'an Anda..."
            rows={3}
            className="resize-none"
          />
        ) : (
          <div className="py-2.5 px-3 rounded-lg bg-muted/30 text-sm min-h-10.5">
            <span className={initialBio ? "text-foreground leading-relaxed" : "text-muted-foreground italic"}>
              {initialBio || "Belum ada bio"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
