import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ShieldAlert } from "lucide-react";

interface RoleFormProps {
  initialData?: {
    nama_role: string;
    kode_role: string;
    is_system?: boolean;
  };
  isSubmitting: boolean;
  onSubmit: (data: { nama_role: string; kode_role: string }) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

export function RoleForm({
  initialData,
  isSubmitting,
  onSubmit,
  onCancel,
  isEdit = false,
}: RoleFormProps) {
  const [namaRole, setNamaRole] = useState(initialData?.nama_role || "");
  const [kodeRole, setKodeRole] = useState(initialData?.kode_role || "");
  const [error, setError] = useState<string | null>(null);

  const isSystemRole = initialData?.is_system ?? false;

  useEffect(() => {
    if (initialData) {
      setNamaRole(initialData.nama_role || "");
      setKodeRole(initialData.kode_role || "");
    }
  }, [initialData]);

  const handleKodeChange = (val: string) => {
    // Format to uppercase with underscores, alphanumeric only
    const formatted = val
      .toUpperCase()
      .replace(/\s+/g, "_")
      .replace(/[^A-Z0-9_]/g, "");
    setKodeRole(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = namaRole.trim();
    const cleanCode = kodeRole.trim();

    if (!cleanName) {
      setError("Nama role wajib diisi");
      return;
    }

    if (!cleanCode) {
      setError("Kode role wajib diisi");
      return;
    }

    onSubmit({
      nama_role: cleanName,
      kode_role: cleanCode,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="py-2 text-xs">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isSystemRole && (
        <Alert className="py-2 bg-amber-500/10 text-amber-600 border-amber-500/30 text-xs">
          <ShieldAlert className="h-4 w-4 mr-1.5" />
          <AlertDescription>
            Ini adalah <strong>Role Sistem</strong> bawaan. Kode role dilindungi dan tidak dapat diubah.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="nama_role" className="text-sm font-medium">
          Nama Role <span className="text-destructive">*</span>
        </Label>
        <Input
          id="nama_role"
          placeholder="Contoh: Staff Keuangan, Asisten Muhafiz"
          value={namaRole}
          onChange={(e) => setNamaRole(e.target.value)}
          disabled={isSubmitting}
          autoFocus
        />
        <p className="text-[11px] text-muted-foreground">
          Nama deskriptif role yang mudah dipahami pengguna.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="kode_role" className="text-sm font-medium">
          Kode Role <span className="text-destructive">*</span>
        </Label>
        <Input
          id="kode_role"
          placeholder="Contoh: STAFF_KEUANGAN"
          value={kodeRole}
          onChange={(e) => handleKodeChange(e.target.value)}
          disabled={isSubmitting || isSystemRole}
          className="font-mono text-sm uppercase"
        />
        <p className="text-[11px] text-muted-foreground">
          Identifier unik role dalam sistem (huruf kapital dan garis bawah).
        </p>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Simpan Perubahan" : "Buat Role"}
        </Button>
      </div>
    </form>
  );
}
