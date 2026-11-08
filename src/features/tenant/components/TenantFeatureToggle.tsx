import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ToggleLeft,
  ToggleRight,
  Sliders,
  GraduationCap,
  ClipboardList,
  Target,
  FileText,
  Users,
  Loader2,
} from "lucide-react";
import { useTenantFeatures, useUpdateTenantFeature } from "../hooks/useTenants";

interface TenantFeatureToggleProps {
  tenantId: number;
}

interface FeatureMeta {
  code: string;
  name: string;
  description: string;
  icon: typeof GraduationCap;
}

const FEATURE_DEFINITIONS: FeatureMeta[] = [
  {
    code: "UJIAN",
    name: "Modul Ujian & Sertifikasi",
    description: "Fitur pendaftaran, pelaksanaan ujian tahfidz, dan penilaian kelulusan",
    icon: GraduationCap,
  },
  {
    code: "RUBRIK",
    name: "Rubrik Penilaian Detail",
    description: "Evaluasi kualitas hafalan dengan rubrik tajwid, makhraj, dan kelancaran",
    icon: ClipboardList,
  },
  {
    code: "TARGET",
    name: "Manajemen Target Hafalan",
    description: "Pengaturan target kurikulum santri per semester dan monitoring deviasi",
    icon: Target,
  },
  {
    code: "BLOG",
    name: "Portal Berita & Blog Lembaga",
    description: "Publikasi artikel, berita kegiatan lembaga, dan informasi publik",
    icon: FileText,
  },
  {
    code: "PORTAL_WALI",
    name: "Portal Orang Tua / Wali",
    description: "Halaman akses mandiri wali santri untuk memantau capaian hafalan",
    icon: Users,
  },
];

export function TenantFeatureToggle({ tenantId }: TenantFeatureToggleProps) {
  const { data: features, isLoading } = useTenantFeatures(tenantId);
  const updateMutation = useUpdateTenantFeature(tenantId);
  const [togglingCode, setTogglingCode] = useState<string | null>(null);

  const isFeatureEnabled = (code: string): boolean => {
    const feat = features?.find((f) => f.feature_code.toUpperCase() === code.toUpperCase());
    return feat ? feat.enabled : true; // Default true as per backend
  };

  const handleToggle = async (code: string, currentEnabled: boolean) => {
    setTogglingCode(code);
    try {
      await updateMutation.mutateAsync({
        feature_code: code,
        enabled: !currentEnabled,
      });
    } finally {
      setTogglingCode(null);
    }
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
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <CardTitle>Fitur & Modul Aktif</CardTitle>
            <CardDescription>
              Aktifkan atau nonaktifkan fitur modular untuk tenant ini
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {FEATURE_DEFINITIONS.map((feat) => {
          const Icon = feat.icon;
          const enabled = isFeatureEnabled(feat.code);
          const isPending = togglingCode === feat.code;

          return (
            <div
              key={feat.code}
              className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/40 transition-colors gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-lg shrink-0 mt-0.5 ${
                    enabled
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">
                      {feat.name}
                    </span>
                    <Badge
                      variant={enabled ? "default" : "outline"}
                      className="text-[10px] uppercase font-mono px-1.5 py-0"
                    >
                      {feat.code}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {feat.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Badge
                  variant={enabled ? "secondary" : "outline"}
                  className={`text-xs ${
                    enabled
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                      : "text-muted-foreground"
                  }`}
                >
                  {enabled ? "Aktif" : "Nonaktif"}
                </Badge>

                <Button
                  size="sm"
                  variant={enabled ? "default" : "outline"}
                  onClick={() => handleToggle(feat.code, enabled)}
                  disabled={isPending}
                  className="h-8 gap-1.5 min-w-[90px]"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : enabled ? (
                    <>
                      <ToggleRight className="w-4 h-4" />
                      <span>Matikan</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4" />
                      <span>Aktifkan</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
