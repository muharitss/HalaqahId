import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Palette,
  Languages,
  Sliders,
  Calendar,
  Layers,
  Loader2,
  School,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTenantDetail } from "../hooks/useTenants";
import { TenantBrandForm } from "../components/TenantBrandForm";
import { TenantTerminologyForm } from "../components/TenantTerminologyForm";
import { TenantFeatureToggle } from "../components/TenantFeatureToggle";
import type { TenantStatus } from "../types";

export function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tenantId = parseInt(id || "", 10);

  const [activeTab, setActiveTab] = useState<string>("overview");

  const { data: tenant, isLoading, error } = useTenantDetail(tenantId);

  if (isNaN(tenantId)) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-destructive font-medium">ID Tenant tidak valid</p>
        <Button variant="outline" onClick={() => navigate("/superadmin/tenants")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Daftar Tenant
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Memuat detail tenant...</p>
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-destructive font-medium">
          Tenant tidak ditemukan atau gagal dimuat
        </p>
        <Button variant="outline" onClick={() => navigate("/superadmin/tenants")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Daftar Tenant
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: TenantStatus) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
            Aktif
          </Badge>
        );
      case "TRIAL":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30">
            Trial
          </Badge>
        );
      case "SUSPENDED":
        return <Badge variant="destructive">Ditangguhkan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Back button & Title header */}
      <div className="space-y-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/superadmin/tenants")}
          className="gap-1.5 text-xs text-muted-foreground hover:text-foreground -ml-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Daftar Tenant
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg shrink-0 overflow-hidden">
              {tenant.brand?.logo_url ? (
                <img
                  src={tenant.brand.logo_url}
                  alt=""
                  className="w-full h-full object-contain"
                />
              ) : (
                tenant.nama_tenant.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-0">
                  {tenant.nama_tenant}
                </h3>
                {getStatusBadge(tenant.status)}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>Slug:</span>
                <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-primary font-semibold">
                  {tenant.slug}
                </code>
                <span>•</span>
                <span>ID: #{tenant.id_tenant}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full sm:w-auto h-auto p-1 bg-muted/60">
          <TabsTrigger value="overview" className="gap-2 py-2 text-xs">
            <Layers className="w-4 h-4" />
            Ringkasan
          </TabsTrigger>
          <TabsTrigger value="brand" className="gap-2 py-2 text-xs">
            <Palette className="w-4 h-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="terminology" className="gap-2 py-2 text-xs">
            <Languages className="w-4 h-4" />
            Terminologi
          </TabsTrigger>
          <TabsTrigger value="features" className="gap-2 py-2 text-xs">
            <Sliders className="w-4 h-4" />
            Fitur
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Ringkasan */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <School className="w-4 h-4 text-primary" />
                  Sekolah / Lembaga
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {tenant._count?.sekolah ?? 0}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Unit sekolah terdaftar
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Total Pengguna
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {tenant._count?.users ?? 0}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Admin, pengajar & staf
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Tanggal Dibuat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-semibold text-foreground">
                  {tenant.created_at
                    ? new Date(tenant.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Status: {tenant.status}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                Informasi Sistem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg border bg-muted/30 space-y-1">
                  <span className="text-muted-foreground">URL Akses Subdomain:</span>
                  <p className="font-mono text-primary font-semibold">
                    https://{tenant.slug}.halaqah.id
                  </p>
                </div>
                <div className="p-3 rounded-lg border bg-muted/30 space-y-1">
                  <span className="text-muted-foreground">Nama Resmi Lembaga:</span>
                  <p className="font-semibold text-foreground">{tenant.nama_tenant}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Brand Form */}
        <TabsContent value="brand">
          <TenantBrandForm tenantId={tenant.id_tenant} />
        </TabsContent>

        {/* Tab 3: Terminology Form */}
        <TabsContent value="terminology">
          <TenantTerminologyForm tenantId={tenant.id_tenant} />
        </TabsContent>

        {/* Tab 4: Feature Toggles */}
        <TabsContent value="features">
          <TenantFeatureToggle tenantId={tenant.id_tenant} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
