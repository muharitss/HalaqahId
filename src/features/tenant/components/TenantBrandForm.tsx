import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette, Loader2 } from "lucide-react";
import { useTenantBrand, useUpdateTenantBrand } from "../hooks/useTenants";
import type { UpdateTenantBrandPayload } from "../types";

interface TenantBrandFormProps {
  tenantId: number;
}

export function TenantBrandForm({ tenantId }: TenantBrandFormProps) {
  const { data: brand, isLoading } = useTenantBrand(tenantId);
  const updateMutation = useUpdateTenantBrand(tenantId);

  const [form, setForm] = useState<UpdateTenantBrandPayload>({
    nama_aplikasi: "",
    logo_url: "",
    favicon_url: "",
    warna_primer: "#059669",
    warna_sekunder: "#10b981",
    copyright_text: "",
    login_background_url: "",
  });

  useEffect(() => {
    if (brand) {
      setForm({
        nama_aplikasi: brand.nama_aplikasi || "",
        logo_url: brand.logo_url || "",
        favicon_url: brand.favicon_url || "",
        warna_primer: brand.warna_primer || "#059669",
        warna_sekunder: brand.warna_sekunder || "#10b981",
        copyright_text: brand.copyright_text || "",
        login_background_url: brand.login_background_url || "",
      });
    }
  }, [brand]);

  const handleChange = (key: keyof UpdateTenantBrandPayload, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMutation.mutateAsync(form);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <CardTitle>Branding & Tampilan Tenant</CardTitle>
            <CardDescription>
              Kustomisasi identitas visual aplikasi untuk institusi ini
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Identitas Aplikasi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="nama_aplikasi">Nama Aplikasi Kustom</Label>
              <Input
                id="nama_aplikasi"
                placeholder="Contoh: Portal Tahfidz Al-Hikmah"
                value={form.nama_aplikasi || ""}
                onChange={(e) => handleChange("nama_aplikasi", e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                Tampil pada navbar dan judul halaman web
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="copyright_text">Teks Hak Cipta (Footer)</Label>
              <Input
                id="copyright_text"
                placeholder="Contoh: © 2026 Yayasan Al-Hikmah. All rights reserved."
                value={form.copyright_text || ""}
                onChange={(e) => handleChange("copyright_text", e.target.value)}
              />
            </div>
          </div>

          {/* Logo & Asset URL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="logo_url">URL Logo</Label>
              <div className="flex gap-2">
                <Input
                  id="logo_url"
                  placeholder="https://.../logo.png"
                  value={form.logo_url || ""}
                  onChange={(e) => handleChange("logo_url", e.target.value)}
                />
                {form.logo_url && (
                  <div className="w-9 h-9 shrink-0 border rounded-md p-1 flex items-center justify-center bg-muted overflow-hidden">
                    <img
                      src={form.logo_url}
                      alt="Logo preview"
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => ((e.target as HTMLElement).style.display = "none")}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="favicon_url">URL Favicon</Label>
              <Input
                id="favicon_url"
                placeholder="https://.../favicon.ico"
                value={form.favicon_url || ""}
                onChange={(e) => handleChange("favicon_url", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="login_background_url">URL Background Login</Label>
              <Input
                id="login_background_url"
                placeholder="https://.../bg.jpg"
                value={form.login_background_url || ""}
                onChange={(e) => handleChange("login_background_url", e.target.value)}
              />
            </div>
          </div>

          {/* Warna Tema */}
          <div className="space-y-3 pt-2 border-t">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" />
              Skema Warna Identitas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="warna_primer">Warna Primer</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="warna_primer_picker"
                    className="w-10 h-10 rounded border p-0.5 cursor-pointer bg-transparent"
                    value={form.warna_primer || "#059669"}
                    onChange={(e) => handleChange("warna_primer", e.target.value)}
                  />
                  <Input
                    id="warna_primer"
                    className="font-mono uppercase text-xs"
                    value={form.warna_primer || ""}
                    onChange={(e) => handleChange("warna_primer", e.target.value)}
                    placeholder="#059669"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="warna_sekunder">Warna Sekunder</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="warna_sekunder_picker"
                    className="w-10 h-10 rounded border p-0.5 cursor-pointer bg-transparent"
                    value={form.warna_sekunder || "#10b981"}
                    onChange={(e) => handleChange("warna_sekunder", e.target.value)}
                  />
                  <Input
                    id="warna_sekunder"
                    className="font-mono uppercase text-xs"
                    value={form.warna_sekunder || ""}
                    onChange={(e) => handleChange("warna_sekunder", e.target.value)}
                    placeholder="#10b981"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview Mini */}
          <div className="p-4 rounded-xl border bg-muted/40 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Preview Komponen Tema
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div
                className="px-4 py-2 rounded-lg text-white font-medium text-xs shadow-xs"
                style={{ backgroundColor: form.warna_primer || "#059669" }}
              >
                Button Primer
              </div>
              <div
                className="px-4 py-2 rounded-lg text-white font-medium text-xs shadow-xs"
                style={{ backgroundColor: form.warna_sekunder || "#10b981" }}
              >
                Button Sekunder
              </div>
              <span className="text-xs text-foreground font-semibold">
                {form.nama_aplikasi || "Nama Aplikasi"}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end border-t pt-4">
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Konfigurasi Brand
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
