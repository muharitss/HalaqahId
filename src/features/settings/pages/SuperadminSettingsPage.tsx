import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Loader2,
  Shield,
  Settings,
  Bot,
  Eye,
  EyeOff,
  Trash2,
  Globe,
  Shuffle,
  LayoutTemplate,
  Trash,
  Edit2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { systemSettingsService } from "../api/systemSettingsService";
import { toast } from "sonner";
import axios from "axios";

export default function SuperadminSettingsPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showWaKey, setShowWaKey] = useState(false);

  // --- Redirects State ---
  const [redirects, setRedirects] = useState<any[]>([]);
  const [fromPath, setFromPath] = useState("");
  const [toPath, setToPath] = useState("");
  const [statusCode, setStatusCode] = useState("301");
  const [editingRedirectId, setEditingRedirectId] = useState<number | null>(null);

  // --- Landing Sections State ---
  const [landingSections, setLandingSections] = useState<any[]>([]);
  const [editingSectionKey, setEditingSectionKey] = useState<string | null>(null);
  const [sectTitle, setSectTitle] = useState("");
  const [sectSubtitle, setSectSubtitle] = useState("");
  const [sectActive, setSectActive] = useState(true);
  const [sectOrder, setSectOrder] = useState("0");

  useEffect(() => {
    fetchSettings();
    fetchRedirects();
    fetchLandingSections();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await systemSettingsService.getSettings();
      if (res.success && res.data) {
        const dataMap: Record<string, string> = {};
        res.data.forEach((item) => {
          dataMap[item.key] = item.value;
        });
        setFormData(dataMap);
      } else {
        toast.error("Gagal memuat pengaturan sistem.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const fetchRedirects = async () => {
    try {
      const res = await axios.get("/api/seo/redirects");
      if (res.data && res.data.success) {
        setRedirects(res.data.data);
      }
    } catch (e) {
      console.error("Gagal memuat pengalihan URL");
    }
  };

  const fetchLandingSections = async () => {
    try {
      const res = await axios.get("/api/landing/admin/sections");
      if (res.data && res.data.success) {
        setLandingSections(res.data.data);
      }
    } catch (e) {
      console.error("Gagal memuat section landing page");
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

  // --- Redirect Handlers ---
  const handleSaveRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromPath || !toPath) return;

    try {
      if (editingRedirectId) {
        await axios.put(`/api/seo/redirects/${editingRedirectId}`, {
          from_path: fromPath,
          to_path: toPath,
          status_code: parseInt(statusCode),
        });
        toast.success("Redireksi berhasil diperbarui!");
      } else {
        await axios.post("/api/seo/redirects", {
          from_path: fromPath,
          to_path: toPath,
          status_code: parseInt(statusCode),
        });
        toast.success("Redireksi baru berhasil dibuat!");
      }
      setFromPath("");
      setToPath("");
      setStatusCode("301");
      setEditingRedirectId(null);
      fetchRedirects();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyimpan redireksi");
    }
  };

  const handleDeleteRedirect = async (id: number) => {
    if (!confirm("Hapus aturan redireksi ini?")) return;
    try {
      await axios.delete(`/api/seo/redirects/${id}`);
      toast.success("Redireksi berhasil dihapus");
      fetchRedirects();
    } catch (e) {
      toast.error("Gagal menghapus redireksi");
    }
  };

  // --- Landing Section Handlers ---
  const handleEditSection = (section: any) => {
    setEditingSectionKey(section.section_key);
    setSectTitle(section.title || "");
    setSectSubtitle(section.subtitle || "");
    setSectActive(section.is_active);
    setSectOrder(section.order.toString());
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSectionKey) return;

    try {
      await axios.put(`/api/landing/admin/sections/${editingSectionKey}`, {
        title: sectTitle,
        subtitle: sectSubtitle,
        is_active: sectActive,
        order: parseInt(sectOrder),
      });
      toast.success("Section landing page berhasil diperbarui!");
      setEditingSectionKey(null);
      fetchLandingSections();
    } catch (e) {
      toast.error("Gagal menyimpan section landing page");
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
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500 text-left">
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
              Kelola konfigurasi sistem global, SEO defaults, redirect paths, dan section landing page.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/superadmin/settings/trash")}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <Trash2 className="h-4 w-4" />
            <span>Tempat Sampah</span>
          </Button>
        </div>
      </div>

      {/* TABS CONTAINER */}
      <Tabs defaultValue="platform" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-8 h-11 p-1 bg-muted/50 rounded-lg">
          <TabsTrigger value="platform" className="flex items-center gap-1.5 text-[11px] font-bold">
            <Settings size={14} />
            <span>Platform</span>
          </TabsTrigger>
          <TabsTrigger value="integrasi" className="flex items-center gap-1.5 text-[11px] font-bold">
            <Bot size={14} />
            <span>Integrasi</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-1.5 text-[11px] font-bold">
            <Globe size={14} />
            <span>SEO</span>
          </TabsTrigger>
          <TabsTrigger value="redirects" className="flex items-center gap-1.5 text-[11px] font-bold">
            <Shuffle size={14} />
            <span>Redirect</span>
          </TabsTrigger>
          <TabsTrigger value="landing" className="flex items-center gap-1.5 text-[11px] font-bold">
            <LayoutTemplate size={14} />
            <span>Landing</span>
          </TabsTrigger>
          <TabsTrigger value="keamanan" className="flex items-center gap-1.5 text-[11px] font-bold">
            <Shield size={14} />
            <span>Keamanan</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB CONTENT: PLATFORM */}
        <TabsContent value="platform">
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
        </TabsContent>

        {/* TAB CONTENT: INTEGRASI */}
        <TabsContent value="integrasi">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">OpenAI API (Tahfidz AI)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai_api_key">API Key</Label>
                  <div className="relative">
                    <Input
                      id="openai_api_key"
                      type={showOpenaiKey ? "text" : "password"}
                      value={formData.openai_api_key || ""}
                      onChange={(e) => handleInputChange("openai_api_key", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                      onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                    >
                      {showOpenaiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Model AI</Label>
                    <Input
                      value={formData.openai_model || ""}
                      onChange={(e) => handleInputChange("openai_model", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Budget Token Bulanan / Sekolah</Label>
                    <Input
                      type="number"
                      value={formData.openai_token_budget_per_school || ""}
                      onChange={(e) => handleInputChange("openai_token_budget_per_school", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Gateway WhatsApp & SMTP</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>WhatsApp Provider</Label>
                    <Input
                      value={formData.wa_gateway_provider || ""}
                      onChange={(e) => handleInputChange("wa_gateway_provider", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp API Key</Label>
                    <div className="relative">
                      <Input
                        type={showWaKey ? "text" : "password"}
                        value={formData.wa_gateway_key || ""}
                        onChange={(e) => handleInputChange("wa_gateway_key", e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
                        onClick={() => setShowWaKey(!showWaKey)}
                      >
                        {showWaKey ? <EyeOff size={14} /> : <Eye size={14} />}
                      </Button>
                    </div>
                  </div>
                </div>
                <Button type="submit" className="font-bold text-xs" disabled={saving}>
                  Simpan Perubahan
                </Button>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        {/* TAB CONTENT: SEO CONFIG */}
        <TabsContent value="seo">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pengaturan Default SEO & Analytics</CardTitle>
                <CardDescription>Konfigurasi default penunjuk mesin telusur.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default Site Title</Label>
                    <Input
                      value={formData.seo_site_title || ""}
                      onChange={(e) => handleInputChange("seo_site_title", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Canonical URL</Label>
                    <Input
                      value={formData.seo_canonical || ""}
                      onChange={(e) => handleInputChange("seo_canonical", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Default Meta Description</Label>
                  <textarea
                    value={formData.seo_default_description || ""}
                    onChange={(e) => handleInputChange("seo_default_description", e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-primary resize-none bg-white dark:bg-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Default Meta Keywords</Label>
                  <Input
                    value={formData.seo_default_keywords || ""}
                    onChange={(e) => handleInputChange("seo_default_keywords", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Google Verification Code</Label>
                    <Input
                      value={formData.seo_google_verification || ""}
                      onChange={(e) => handleInputChange("seo_google_verification", e.target.value)}
                      placeholder="Masukkan kode google-site-verification..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Google Analytics ID (GA4)</Label>
                    <Input
                      value={formData.seo_analytics_id || ""}
                      onChange={(e) => handleInputChange("seo_analytics_id", e.target.value)}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Favicon URL</Label>
                    <Input
                      value={formData.seo_favicons || ""}
                      onChange={(e) => handleInputChange("seo_favicons", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Logo URL</Label>
                    <Input
                      value={formData.seo_logo || ""}
                      onChange={(e) => handleInputChange("seo_logo", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default OG Image URL</Label>
                    <Input
                      value={formData.seo_og_image_default || ""}
                      onChange={(e) => handleInputChange("seo_og_image_default", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Twitter Image URL</Label>
                    <Input
                      value={formData.seo_twitter_image_default || ""}
                      onChange={(e) => handleInputChange("seo_twitter_image_default", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Robots.txt Content</Label>
                  <textarea
                    value={formData.seo_robots || ""}
                    onChange={(e) => handleInputChange("seo_robots", e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-mono focus:outline-none focus:border-primary resize-none bg-white dark:bg-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Organization Schema (JSON-LD)</Label>
                    <textarea
                      value={formData.seo_organization_schema || ""}
                      onChange={(e) => handleInputChange("seo_organization_schema", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-xl text-xs font-mono focus:outline-none focus:border-primary bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Social Links (JSON Array)</Label>
                    <textarea
                      value={formData.seo_social_links || ""}
                      onChange={(e) => handleInputChange("seo_social_links", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-xl text-xs font-mono focus:outline-none focus:border-primary bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>

                <Button type="submit" className="font-bold text-xs" disabled={saving}>
                  Simpan Perubahan SEO
                </Button>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        {/* TAB CONTENT: REDIRECT PATHS */}
        <TabsContent value="redirects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {editingRedirectId ? "Edit Redireksi" : "Tambah Redireksi"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveRedirect} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fromPath">Path Asal (From Path)</Label>
                      <Input
                        id="fromPath"
                        value={fromPath}
                        onChange={(e) => setFromPath(e.target.value)}
                        placeholder="Contoh: /blog-lama"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="toPath">Path Tujuan (To Path)</Label>
                      <Input
                        id="toPath"
                        value={toPath}
                        onChange={(e) => setToPath(e.target.value)}
                        placeholder="Contoh: /blog"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="statusCode">Status HTTP</Label>
                      <Select value={statusCode} onValueChange={setStatusCode}>
                        <SelectTrigger id="statusCode">
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="301">301 - Permanent Redirect</SelectItem>
                          <SelectItem value="302">302 - Temporary Redirect</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1 font-bold text-xs">
                        Simpan Rule
                      </Button>
                      {editingRedirectId && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setEditingRedirectId(null);
                            setFromPath("");
                            setToPath("");
                            setStatusCode("301");
                          }}
                          className="text-xs"
                        >
                          Batal
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Daftar Redirects Terdaftar</CardTitle>
                </CardHeader>
                <CardContent>
                  {redirects.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-sm">Belum ada pengalihan URL.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="border-b bg-slate-50 dark:bg-slate-900/50 uppercase text-[9px] font-black text-slate-400">
                            <th className="p-3">Dari Path</th>
                            <th className="p-3">Ke Path</th>
                            <th className="p-3">Status HTTP</th>
                            <th className="p-3 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {redirects.map((red) => (
                            <tr key={red.id_redirect} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                              <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200">{red.from_path}</td>
                              <td className="p-3 font-mono text-slate-550">{red.to_path}</td>
                              <td className="p-3">
                                <span className="px-1.5 py-0.5 rounded font-black bg-primary/10 text-primary text-[9px]">
                                  {red.status_code}
                                </span>
                              </td>
                              <td className="p-3 text-right space-x-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-primary"
                                  onClick={() => {
                                    setEditingRedirectId(red.id_redirect);
                                    setFromPath(red.from_path);
                                    setToPath(red.to_path);
                                    setStatusCode(red.status_code.toString());
                                  }}
                                >
                                  <Edit2 size={12} />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-red-500"
                                  onClick={() => handleDeleteRedirect(red.id_redirect)}
                                >
                                  <Trash size={12} />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB CONTENT: LANDING PAGE EDITOR */}
        <TabsContent value="landing" className="space-y-6">
          {editingSectionKey ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4 mb-4">
                <div>
                  <CardTitle className="text-base">Edit Section: {editingSectionKey.toUpperCase()}</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setEditingSectionKey(null)}>
                  Batal
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveSection} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sectTitle">Judul Section</Label>
                    <Input
                      id="sectTitle"
                      value={sectTitle}
                      onChange={(e) => setSectTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sectSub">Subjudul / Deskripsi Section</Label>
                    <textarea
                      id="sectSub"
                      value={sectSubtitle}
                      onChange={(e) => setSectSubtitle(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-primary resize-none bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sectOrder">Urutan (Order)</Label>
                      <Input
                        id="sectOrder"
                        type="number"
                        value={sectOrder}
                        onChange={(e) => setSectOrder(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={sectActive ? "true" : "false"} onValueChange={(val) => setSectActive(val === "true")}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Aktif (Tampil Publik)</SelectItem>
                          <SelectItem value="false">Nonaktif (Sembunyikan)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" className="font-bold text-xs">
                    Simpan Section
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Kelola Section Landing Page</CardTitle>
                <CardDescription>Aktifkan/nonaktifkan dan edit teks global landing page secara langsung.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b bg-slate-50 dark:bg-slate-900/50 uppercase text-[9px] font-black text-slate-400">
                        <th className="p-3">Key Section</th>
                        <th className="p-3">Judul Tampil</th>
                        <th className="p-3">Urutan</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {landingSections.map((sec) => (
                        <tr key={sec.id_section} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                          <td className="p-3 font-bold font-mono text-slate-800 dark:text-slate-200">{sec.section_key}</td>
                          <td className="p-3 font-medium text-slate-550 max-w-xs truncate">{sec.title || <span className="text-slate-300">-</span>}</td>
                          <td className="p-3 font-semibold">{sec.order}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase ${
                              sec.is_active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                            }`}>
                              {sec.is_active ? "Aktif" : "Mati"}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-primary"
                              onClick={() => handleEditSection(sec)}
                            >
                              <Edit2 size={12} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* TAB CONTENT: KEAMANAN */}
        <TabsContent value="keamanan">
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
        </TabsContent>

      </Tabs>
    </div>
  );
}
