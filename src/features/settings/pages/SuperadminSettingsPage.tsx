import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Save, Loader2, Shield, Settings, Database, Bot, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { systemSettingsService } from "../api/systemSettingsService";
import { toast } from "sonner";

export default function SuperadminSettingsPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showWaKey, setShowWaKey] = useState(false);
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await systemSettingsService.getSettings();
      if (res.success && res.data) {
        const dataMap: Record<string, string> = {};
        const descMap: Record<string, string> = {};
        res.data.forEach((item) => {
          dataMap[item.key] = item.value;
          descMap[item.key] = item.description;
        });
        setFormData(dataMap);
        setDescriptions(descMap);
      } else {
        toast.error("Gagal memuat pengaturan sistem.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await systemSettingsService.updateSettings(formData);
      if (res.success) {
        toast.success("Pengaturan sistem berhasil diperbarui!");
        // Refresh local state to synchronize masked values
        if (res.data) {
          const dataMap: Record<string, string> = {};
          res.data.forEach((item) => {
            dataMap[item.key] = item.value;
          });
          setFormData(dataMap);
        }
      } else {
        toast.error("Gagal menyimpan pengaturan.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Memuat pengaturan sistem...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => navigate("/superadmin")}
            className="rounded-full h-10 w-10 shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Pengaturan Platform</h1>
            <p className="text-muted-foreground text-sm">
              Kelola konfigurasi sistem global, integrasi API gateway, dan kebijakan platform.
            </p>
          </div>
        </div>

        <Button type="submit" disabled={saving} className="flex items-center gap-2">
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>{saving ? "Menyimpan..." : "Simpan Perubahan"}</span>
        </Button>
      </div>

      {/* TABS CONTAINER */}
      <Tabs defaultValue="platform" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 h-11 p-1 bg-muted/50 rounded-lg">
          <TabsTrigger value="platform" className="flex items-center gap-2">
            <Settings size={16} />
            <span>Platform</span>
          </TabsTrigger>
          <TabsTrigger value="integrasi" className="flex items-center gap-2">
            <Bot size={16} />
            <span>Integrasi & API</span>
          </TabsTrigger>
          <TabsTrigger value="keamanan" className="flex items-center gap-2">
            <Shield size={16} />
            <span>Keamanan & Sesi</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB CONTENT: PLATFORM */}
        <TabsContent value="platform" className="space-y-5 outline-none">
          <Card className="border border-primary/5 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-primary">
                <Settings size={18} />
                Umum & Registrasi
              </CardTitle>
              <CardDescription>
                Konfigurasi umum platform HalaqahId dan kebijakan pendaftaran sekolah.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* App Name */}
                <div className="space-y-2">
                  <Label htmlFor="app_name">Nama Platform</Label>
                  <Input
                    id="app_name"
                    value={formData.app_name || ""}
                    onChange={(e) => handleInputChange("app_name", e.target.value)}
                    placeholder="Contoh: HalaqahId"
                  />
                  <p className="text-xs text-muted-foreground">{descriptions.app_name}</p>
                </div>

                {/* Registration Policy */}
                <div className="space-y-2">
                  <Label htmlFor="registration_policy">Kebijakan Registrasi Sekolah</Label>
                  <Select
                    value={formData.registration_policy || "OPEN"}
                    onValueChange={(val) => handleInputChange("registration_policy", val)}
                  >
                    <SelectTrigger id="registration_policy">
                      <SelectValue placeholder="Pilih kebijakan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">Terbuka (Siapa saja bisa mendaftar)</SelectItem>
                      <SelectItem value="APPROVAL">Persetujuan (Memerlukan approval Superadmin)</SelectItem>
                      <SelectItem value="CLOSED">Tertutup (Pendaftaran baru dinonaktifkan)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{descriptions.registration_policy}</p>
                </div>

                {/* Maintenance Mode */}
                <div className="space-y-2">
                  <Label htmlFor="maintenance_mode">Mode Pemeliharaan (Maintenance)</Label>
                  <Select
                    value={formData.maintenance_mode || "false"}
                    onValueChange={(val) => handleInputChange("maintenance_mode", val)}
                  >
                    <SelectTrigger id="maintenance_mode">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">Nonaktif (Sistem berjalan normal)</SelectItem>
                      <SelectItem value="true">Aktif (Sistem dikunci untuk pemeliharaan)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{descriptions.maintenance_mode}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB CONTENT: INTEGRASI */}
        <TabsContent value="integrasi" className="space-y-5 outline-none">
          {/* OpenAI Configuration */}
          <Card className="border border-primary/5 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-blue-500">
                <Bot size={18} />
                Tahfidz AI (OpenAI API)
              </CardTitle>
              <CardDescription>
                Hubungkan kecerdasan buatan untuk asisten hafalan santri Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="openai_api_key">OpenAI API Key</Label>
                  <div className="relative">
                    <Input
                      id="openai_api_key"
                      type={showOpenaiKey ? "text" : "password"}
                      value={formData.openai_api_key || ""}
                      onChange={(e) => handleInputChange("openai_api_key", e.target.value)}
                      placeholder="Masukkan sk-..."
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                      onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                    >
                      {showOpenaiKey ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">{descriptions.openai_api_key}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="openai_model">Default AI Model</Label>
                  <Select
                    value={formData.openai_model || "gpt-4o-mini"}
                    onValueChange={(val) => handleInputChange("openai_model", val)}
                  >
                    <SelectTrigger id="openai_model">
                      <SelectValue placeholder="Pilih model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o-mini">gpt-4o-mini (Rekomendasi - Cepat & Murah)</SelectItem>
                      <SelectItem value="gpt-4o">gpt-4o (Kemampuan tinggi & Akurat)</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{descriptions.openai_model}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="openai_token_budget_per_school">Kuota Token Bulanan per Sekolah</Label>
                  <Input
                    id="openai_token_budget_per_school"
                    type="number"
                    min="0"
                    value={formData.openai_token_budget_per_school || "100000"}
                    onChange={(e) => handleInputChange("openai_token_budget_per_school", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">{descriptions.openai_token_budget_per_school}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Gateway & Email Gateway */}
          <Card className="border border-primary/5 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-primary">
                Gateway Komunikasi
              </CardTitle>
              <CardDescription>
                Atur pengiriman notifikasi WhatsApp ke orang tua santri dan pengiriman email laporan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* WhatsApp Provider */}
                <div className="space-y-2">
                  <Label htmlFor="wa_gateway_provider">WhatsApp Provider</Label>
                  <Select
                    value={formData.wa_gateway_provider || "fonnte"}
                    onValueChange={(val) => handleInputChange("wa_gateway_provider", val)}
                  >
                    <SelectTrigger id="wa_gateway_provider">
                      <SelectValue placeholder="Pilih provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fonnte">Fonnte (Rekomendasi Indonesia)</SelectItem>
                      <SelectItem value="twilio">Twilio (Global)</SelectItem>
                      <SelectItem value="other">Lainnya / Manual</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{descriptions.wa_gateway_provider}</p>
                </div>

                {/* WhatsApp Key */}
                <div className="space-y-2">
                  <Label htmlFor="wa_gateway_key">WhatsApp API Key</Label>
                  <div className="relative">
                    <Input
                      id="wa_gateway_key"
                      type={showWaKey ? "text" : "password"}
                      value={formData.wa_gateway_key || ""}
                      onChange={(e) => handleInputChange("wa_gateway_key", e.target.value)}
                      placeholder="Masukkan token API WA"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                      onClick={() => setShowWaKey(!showWaKey)}
                    >
                      {showWaKey ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">{descriptions.wa_gateway_key}</p>
                </div>

                {/* SMTP Host */}
                <div className="space-y-2">
                  <Label htmlFor="smtp_host">SMTP Host</Label>
                  <Input
                    id="smtp_host"
                    value={formData.smtp_host || ""}
                    onChange={(e) => handleInputChange("smtp_host", e.target.value)}
                    placeholder="smtp.mailgun.org atau smtp.gmail.com"
                  />
                  <p className="text-xs text-muted-foreground">{descriptions.smtp_host}</p>
                </div>

                {/* SMTP Port */}
                <div className="space-y-2">
                  <Label htmlFor="smtp_port">SMTP Port</Label>
                  <Input
                    id="smtp_port"
                    value={formData.smtp_port || "587"}
                    onChange={(e) => handleInputChange("smtp_port", e.target.value)}
                    placeholder="587 atau 465"
                  />
                  <p className="text-xs text-muted-foreground">{descriptions.smtp_port}</p>
                </div>

                {/* SMTP User */}
                <div className="space-y-2">
                  <Label htmlFor="smtp_user">SMTP Username</Label>
                  <Input
                    id="smtp_user"
                    value={formData.smtp_user || ""}
                    onChange={(e) => handleInputChange("smtp_user", e.target.value)}
                    placeholder="postmaster@yourdomain.com"
                  />
                  <p className="text-xs text-muted-foreground">{descriptions.smtp_user}</p>
                </div>

                {/* SMTP Password */}
                <div className="space-y-2">
                  <Label htmlFor="smtp_password">SMTP Password</Label>
                  <div className="relative">
                    <Input
                      id="smtp_password"
                      type={showSmtpPassword ? "text" : "password"}
                      value={formData.smtp_password || ""}
                      onChange={(e) => handleInputChange("smtp_password", e.target.value)}
                      placeholder="Masukkan password email"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                      onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                    >
                      {showSmtpPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">{descriptions.smtp_password}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB CONTENT: KEAMANAN & SESI */}
        <TabsContent value="keamanan" className="space-y-5 outline-none">
          <Card className="border border-primary/5 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-violet-500">
                <Database size={18} />
                Sesi & Retensi Data
              </CardTitle>
              <CardDescription>
                Kelola waktu kedaluwarsa login pengguna dan masa simpan data terhapus.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* JWT Expiry */}
                <div className="space-y-2">
                  <Label htmlFor="jwt_expiry_minutes">Masa Aktif Token Sesi (JWT - Menit)</Label>
                  <Input
                    id="jwt_expiry_minutes"
                    type="number"
                    min="1"
                    value={formData.jwt_expiry_minutes || "60"}
                    onChange={(e) => handleInputChange("jwt_expiry_minutes", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">{descriptions.jwt_expiry_minutes}</p>
                </div>

                {/* Trash Retention */}
                <div className="space-y-2">
                  <Label htmlFor="trash_retention_days">Retensi Tempat Sampah (Hari)</Label>
                  <Input
                    id="trash_retention_days"
                    type="number"
                    min="1"
                    value={formData.trash_retention_days || "30"}
                    onChange={(e) => handleInputChange("trash_retention_days", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">{descriptions.trash_retention_days}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
}
