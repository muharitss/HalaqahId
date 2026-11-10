import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  Sparkles,
  BookOpen,
  Award,
  Bookmark,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import type { SetoranData } from "../types";

interface RecentSetoranTimelineCardProps {
  setoranList: SetoranData[];
  todaySetoranCount: number;
  loading: boolean;
}

/** Helper aman untuk mengambil nama kategori baik berupa string maupun objek */
function extractKategoriName(kategoriRaw: unknown): string {
  if (!kategoriRaw) return "Hafalan";
  if (typeof kategoriRaw === "string") return kategoriRaw;
  if (typeof kategoriRaw === "object") {
    const obj = kategoriRaw as Record<string, unknown>;
    if (typeof obj.nama_kategori === "string") return obj.nama_kategori;
    if (typeof obj.nama === "string") return obj.nama;
  }
  return String(kategoriRaw);
}

export function RecentSetoranTimelineCard({
  setoranList,
  todaySetoranCount,
  loading,
}: RecentSetoranTimelineCardProps) {
  const navigate = useNavigate();

  // Ambil 6 data setoran paling baru
  const recentItems = (setoranList || []).slice(0, 6);

  const getStepVisual = (kategoriRaw: unknown) => {
    const kategoriName = extractKategoriName(kategoriRaw);
    const kat = kategoriName.toUpperCase();
    if (kat.includes("ZIYADAH")) {
      return {
        icon: Sparkles,
        gradient: "bg-gradient-to-tr from-emerald-600 to-emerald-400 shadow-emerald-500/25",
        badgeClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      };
    }
    if (kat.includes("MURAJAAH") || kat.includes("MURAJA'AH")) {
      return {
        icon: BookOpen,
        gradient: "bg-gradient-to-tr from-blue-600 to-blue-400 shadow-blue-500/25",
        badgeClass: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      };
    }
    if (kat.includes("HAFALAN") || kat.includes("INTENS")) {
      return {
        icon: Award,
        gradient: "bg-gradient-to-tr from-amber-600 to-amber-400 shadow-amber-500/25",
        badgeClass: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      };
    }
    return {
      icon: Bookmark,
      gradient: "bg-gradient-to-tr from-purple-600 to-purple-400 shadow-purple-500/25",
      badgeClass: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    };
  };

  const formatTimestamp = (dateStr?: unknown) => {
    if (!dateStr) return "Hari ini";
    try {
      const d = new Date(String(dateStr));
      if (isNaN(d.getTime())) return String(dateStr);
      return format(d, "dd MMM yyyy, HH:mm", { locale: idLocale });
    } catch {
      return String(dateStr);
    }
  };

  return (
    <Card className="shadow-sm border border-border/70 bg-card rounded-xl overflow-hidden h-full flex flex-col justify-between">
      <div>
        <CardHeader className="p-4 pb-3 border-b border-border/50">
          <div className="space-y-0.5">
            <h6 className="text-base font-bold tracking-tight text-foreground">
              Aktivitas Setoran Terbaru
            </h6>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span className="font-semibold text-foreground">{todaySetoranCount} setoran</span> tercatat hari ini
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-3 flex-1 overflow-y-auto max-h-[380px] scrollbar-thin">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-2.5 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <BookOpen className="h-10 w-10 text-muted-foreground/30 mb-2" />
              <p className="text-sm font-semibold text-foreground">Belum Ada Setoran</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Riwayat setoran hafalan terbaru akan muncul di timeline ini.
              </p>
            </div>
          ) : (
            <div className="relative pl-6 space-y-4 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-border/60">
              {recentItems.map((item, idx) => {
                const visual = getStepVisual(item.kategori);
                const Icon = visual.icon;
                const santriName = item.santri?.nama_santri || (item.id_santri ? `Santri #${item.id_santri}` : "Santri");
                const kategoriLabel = extractKategoriName(item.kategori);

                // Buat ringkasan hafalan (misal: "Juz 30 • An-Naba : 1-10" jika ada)
                const hafalanDetail = item.juz
                  ? `Juz ${item.juz}${item.surat ? ` • ${item.surat}` : ""}${item.ayat ? ` : ${item.ayat}` : ""}`
                  : null;

                return (
                  <div key={item.id_setoran || idx} className="relative flex items-start gap-3 group">
                    <div
                      className={`absolute -left-6 top-0.5 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-sm ring-4 ring-background shrink-0 ${visual.gradient}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {santriName}
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-[9px] px-1.5 py-0 font-semibold tracking-wide uppercase shrink-0 ${visual.badgeClass}`}
                        >
                          {kategoriLabel}
                        </Badge>
                      </div>

                      {hafalanDetail && (
                        <p className="text-[11px] text-foreground/80 truncate">
                          {hafalanDetail}
                        </p>
                      )}

                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                        <span className="truncate">{formatTimestamp(item.tanggal_setoran)}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </div>

      <div className="p-3 px-4 border-t border-border/50 bg-muted/10 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">
          Log hafalan waktu nyata
        </span>
        <Button
          variant="link"
          size="sm"
          onClick={() => navigate("/kepala-muhafidz/laporan")}
          className="text-xs h-auto p-0 text-primary font-medium flex items-center gap-1"
        >
          <span>Laporan Lengkap</span>
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  );
}
