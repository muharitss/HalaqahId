import { Award, FileBadge2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MuhafizProfileFieldsProps {
  isEditing: boolean;
  spesialisasi: string;
  onSpesialisasiChange: (value: string) => void;
  initialSpesialisasi: string;
  noIjazah: string;
  onNoIjazahChange: (value: string) => void;
  initialNoIjazah: string;
}

export function MuhafizProfileFields({
  isEditing,
  spesialisasi,
  onSpesialisasiChange,
  initialSpesialisasi,
  noIjazah,
  onNoIjazahChange,
  initialNoIjazah,
}: MuhafizProfileFieldsProps) {
  return (
    <div className="pt-2 border-t space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
        Informasi Pengajar Tahfidz
      </h4>

      {/* Spesialisasi */}
      <div className="space-y-1.5">
        <Label
          htmlFor="profil-spesialisasi"
          className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5"
        >
          <Award className="h-3.5 w-3.5" />
          Spesialisasi / Keahlian
        </Label>
        {isEditing ? (
          <Input
            id="profil-spesialisasi"
            value={spesialisasi}
            onChange={(e) => onSpesialisasiChange(e.target.value)}
            placeholder="Contoh: Tahfidz 30 Juz, Tahsin Jazariyah, Qira'at"
            className="h-10"
          />
        ) : (
          <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-muted/30 text-sm">
            <span className={initialSpesialisasi ? "font-medium" : "text-muted-foreground italic"}>
              {initialSpesialisasi || "Belum diisi"}
            </span>
          </div>
        )}
      </div>

      {/* Nomor Ijazah / Sertifikat */}
      <div className="space-y-1.5">
        <Label
          htmlFor="profil-no-ijazah"
          className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5"
        >
          <FileBadge2 className="h-3.5 w-3.5" />
          Nomor Ijazah / Sanad Tahfidz
        </Label>
        {isEditing ? (
          <Input
            id="profil-no-ijazah"
            value={noIjazah}
            onChange={(e) => onNoIjazahChange(e.target.value)}
            placeholder="Contoh: SANAD-TAHFIDZ-2024-001"
            className="h-10"
          />
        ) : (
          <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-muted/30 text-sm">
            <span className={initialNoIjazah ? "font-medium" : "text-muted-foreground italic"}>
              {initialNoIjazah || "Belum diisi"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
