import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface KeamananSettingsCardProps {
  formData: Record<string, string>;
  saving: boolean;
  handleInputChange: (key: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export function KeamananSettingsCard({
  formData,
  saving,
  handleInputChange,
  handleSubmit,
}: KeamananSettingsCardProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sesi & Retensi Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>JWT Sesi Expiry (Menit)</Label>
              <Input
                type="number"
                value={formData.jwt_expiry_minutes || ""}
                onChange={(e) => handleInputChange("jwt_expiry_minutes", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Retensi Tempat Sampah (Hari)</Label>
              <Input
                type="number"
                value={formData.trash_retention_days || ""}
                onChange={(e) => handleInputChange("trash_retention_days", e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="font-bold text-xs" disabled={saving}>
            Simpan Perubahan Keamanan
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
