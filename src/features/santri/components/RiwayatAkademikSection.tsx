import { useRiwayatAkademik } from "../api/queries/useRiwayatAkademik";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Term } from "@/components/ui/Term";
import { type StatusAkademik, STATUS_AKADEMIK_LABELS } from "../types";
import {
  GraduationCap,
  Calendar,
  Layers,
  History,
  Loader2,
  UserCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  AlertCircle,
  XCircle,
} from "lucide-react";

export interface RiwayatAkademikSectionProps {
  santriId: number;
  santriName?: string;
}

export function RiwayatAkademikSection({
  santriId,
  santriName,
}: RiwayatAkademikSectionProps) {
  const { data: riwayatList = [], isLoading, error } = useRiwayatAkademik(santriId);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const renderStatusBadge = (status: StatusAkademik) => {
    switch (status) {
      case "NAIK":
        return (
          <Badge
            variant="secondary"
            className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 font-medium inline-flex items-center gap-1"
          >
            <ArrowUpRight className="h-3 w-3" />
            {STATUS_AKADEMIK_LABELS.NAIK}
          </Badge>
        );
      case "TETAP":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 font-medium inline-flex items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            {STATUS_AKADEMIK_LABELS.TETAP}
          </Badge>
        );
      case "LULUS":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 font-medium inline-flex items-center gap-1"
          >
            <CheckCircle2 className="h-3 w-3" />
            {STATUS_AKADEMIK_LABELS.LULUS}
          </Badge>
        );
      case "KELUAR":
        return (
          <Badge
            variant="destructive"
            className="bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 font-medium inline-flex items-center gap-1"
          >
            <XCircle className="h-3 w-3" />
            {STATUS_AKADEMIK_LABELS.KELUAR}
          </Badge>
        );
      case "AKTIF":
      default:
        return (
          <Badge
            variant="outline"
            className="bg-teal-100 text-teal-800 dark:bg-teal-950/40 dark:text-teal-400 border-teal-200 font-medium inline-flex items-center gap-1"
          >
            <CheckCircle2 className="h-3 w-3" />
            {STATUS_AKADEMIK_LABELS.AKTIF}
          </Badge>
        );
    }
  };

  const getStatusColor = (status: StatusAkademik) => {
    switch (status) {
      case "NAIK":
        return "bg-emerald-500 ring-emerald-100 dark:ring-emerald-950/50";
      case "TETAP":
        return "bg-amber-500 ring-amber-100 dark:ring-amber-950/50";
      case "LULUS":
        return "bg-blue-500 ring-blue-100 dark:ring-blue-950/50";
      case "KELUAR":
        return "bg-rose-500 ring-rose-100 dark:ring-rose-950/50";
      case "AKTIF":
      default:
        return "bg-primary ring-primary/20";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
        <div>
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            Riwayat Akademik & Kenaikan Level
          </h3>
          <p className="text-xs text-muted-foreground">
            Rekam jejak tahun ajaran, kenaikan jenjang level, dan penempatan{" "}
            {santriName ? <strong>{santriName}</strong> : "santri"}.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mb-2" />
          <span className="text-xs">Memuat riwayat akademik...</span>
        </div>
      ) : error ? (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-4 text-xs text-destructive text-center">
            {error.message || "Gagal memuat riwayat akademik"}
          </CardContent>
        </Card>
      ) : riwayatList.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center bg-muted/20">
          <GraduationCap className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium text-foreground">
            Belum Ada Riwayat Akademik
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {santriName || "Santri ini"} belum memiliki catatan riwayat tahun ajaran atau kenaikan level.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
          {riwayatList.map((item) => {
            const halaqahName =
              item.halaqah?.nama_halaqah ||
              item.halaqah?.name_halaqah ||
              (item.id_halaqah ? `Halaqah #${item.id_halaqah}` : "-");

            return (
              <div key={item.id_riwayat} className="relative group">
                {/* Timeline node */}
                <div
                  className={`absolute -left-[27px] top-1.5 h-3.5 w-3.5 rounded-full ring-4 transition-transform group-hover:scale-110 ${getStatusColor(
                    item.status
                  )}`}
                />

                <Card className="shadow-xs transition-shadow hover:shadow-sm">
                  <CardContent className="p-4 space-y-3">
                    {/* Header: Tahun Ajaran & Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2.5">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-sm text-foreground">
                          {item.tahun_ajaran?.nama || `Tahun Ajaran #${item.id_tahun_ajaran}`}
                        </span>
                        {item.tahun_ajaran?.is_aktif && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-emerald-300 text-emerald-700 bg-emerald-50">
                            Aktif
                          </Badge>
                        )}
                      </div>
                      <div>{renderStatusBadge(item.status)}</div>
                    </div>

                    {/* Level & Program + Halaqah */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <span className="text-muted-foreground flex items-center gap-1 font-medium">
                          <Layers className="h-3 w-3 text-primary" />
                          Level & Program:
                        </span>
                        <div className="font-medium text-foreground">
                          {item.level ? (
                            <span>
                              {item.level.nama_level}
                              {item.level.program && (
                                <span className="text-muted-foreground font-normal">
                                  {" "}({item.level.program.nama_program})
                                </span>
                              )}
                              {(item.level.target_juz_min !== undefined || item.level.target_juz_max !== undefined) && (
                                <span className="text-muted-foreground block text-[11px]">
                                  Target: Juz {item.level.target_juz_min ?? 0} &ndash; {item.level.target_juz_max ?? 30}
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic">Belum ditentukan</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-muted-foreground flex items-center gap-1 font-medium">
                          <History className="h-3 w-3 text-primary" />
                          Penempatan <Term code="HALAQAH" />:
                        </span>
                        <div className="font-medium text-foreground">
                          {halaqahName}
                        </div>
                      </div>
                    </div>

                    {/* Alasan / Catatan */}
                    {item.alasan && (
                      <div className="rounded-md bg-muted/40 p-2.5 text-xs text-muted-foreground border">
                        <div className="flex items-center gap-1 font-medium text-foreground mb-0.5">
                          <AlertCircle className="h-3 w-3 text-primary" />
                          Catatan / Alasan:
                        </div>
                        <p className="italic">"{item.alasan}"</p>
                      </div>
                    )}

                    {/* Footer: Tanggal & Approver */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        <span>
                          {item.tanggal_mulai
                            ? `Mulai: ${formatDate(item.tanggal_mulai)}`
                            : `Dicatat: ${formatDate(item.created_at)}`}
                          {item.tanggal_selesai ? ` s.d. ${formatDate(item.tanggal_selesai)}` : ""}
                        </span>
                      </div>

                      {item.user?.name && (
                        <div className="flex items-center gap-1">
                          <UserCheck className="h-3 w-3" />
                          <span>Disetujui oleh: <strong className="text-foreground">{item.user.name}</strong></span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
