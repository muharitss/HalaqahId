import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PlatformSettingsCardProps {
  formData: Record<string, string>;
  saving: boolean;
  handleInputChange: (key: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export function PlatformSettingsCard({
  formData,
  saving,
  handleInputChange,
  handleSubmit,
}: PlatformSettingsCardProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Umum & Registrasi</CardTitle>
          <CardDescription>Kebijakan global registrasi sekolah baru.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="app_name">Nama Platform</Label>
              <Input
                id="app_name"
                value={formData.app_name || ""}
                onChange={(e) => handleInputChange("app_name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registration_policy">Kebijakan Registrasi</Label>
              <Select
                value={formData.registration_policy || "OPEN"}
                onValueChange={(val) => handleInputChange("registration_policy", val)}
              >
                <SelectTrigger id="registration_policy">
                  <SelectValue placeholder="Pilih kebijakan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN">Terbuka</SelectItem>
                  <SelectItem value="APPROVAL">Persetujuan</SelectItem>
                  <SelectItem value="CLOSED">Tertutup</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenance_mode">Mode Pemeliharaan</Label>
              <Select
                value={formData.maintenance_mode || "false"}
                onValueChange={(val) => handleInputChange("maintenance_mode", val)}
              >
                <SelectTrigger id="maintenance_mode">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Nonaktif</SelectItem>
                  <SelectItem value="true">Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="font-bold text-xs" disabled={saving}>
            {saving ? <Loader2 className="animate-spin mr-1" size={14} /> : null}
            Simpan Perubahan
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
