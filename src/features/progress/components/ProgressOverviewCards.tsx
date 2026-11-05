import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle, Flame, Layers, Award, Calendar } from "lucide-react";
import type { ProgressSummaryData } from "../types";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface ProgressOverviewCardsProps {
  summaryData: ProgressSummaryData | null;
  isLoading?: boolean;
}

export function ProgressOverviewCards({
  summaryData,
  isLoading,
}: ProgressOverviewCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  const s = summaryData?.summary;
  const totalSelesaiDanLancar = (s?.total_surat_selesai || 0) + (s?.total_surat_lancar || 0);
  const persentase = s?.persentase_keseluruhan ?? 0;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Card 1: Total Juz */}
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Juz Selesai</p>
              <div className="text-2xl font-bold tracking-tight">
                {s?.total_juz_selesai ?? 0}
                <span className="text-xs text-muted-foreground font-normal ml-1">/ 30</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {s?.daftar_juz_selesai && s.daftar_juz_selesai.length > 0
                  ? `Juz: ${s.daftar_juz_selesai.join(", ")}`
                  : "Belum ada juz tuntas"}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Award className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Surat Selesai */}
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Surat Selesai & Lancar</p>
              <div className="text-2xl font-bold tracking-tight">
                {totalSelesaiDanLancar}
                <span className="text-xs text-muted-foreground font-normal ml-1">/ 114</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {s?.total_surat_proses ?? 0} sedang proses · {s?.total_surat_belum ?? 114} belum
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Total Halaman & Ayat */}
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Halaman & Ayat Selesai</p>
              <div className="text-2xl font-bold tracking-tight">
                {s?.total_halaman_selesai ?? 0}
                <span className="text-xs text-muted-foreground font-normal ml-1">/ 604 Hal</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {s?.total_ayat_selesai?.toLocaleString("id-ID") ?? 0} ayat tuntas
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Layers className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Persentase Global */}
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1 w-full mr-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Total Hafalan</p>
                <span className="text-xs font-bold text-primary">{persentase}%</span>
              </div>
              <div className="text-2xl font-bold tracking-tight text-primary">
                {persentase}%
              </div>
              <Progress value={persentase} className="h-2 w-full mt-1" />
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <CheckCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date metadata footer bar */}
      {(s?.last_setoran || s?.last_murajaah) && (
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground bg-muted/40 px-3 py-2 rounded-lg border">
          {s?.last_setoran && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>
                Setoran Terakhir:{" "}
                <b>{format(new Date(s.last_setoran), "dd MMMM yyyy", { locale: idLocale })}</b>
              </span>
            </div>
          )}
          {s?.last_murajaah && (
            <div className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-amber-500" />
              <span>
                Murajaah Terakhir:{" "}
                <b>{format(new Date(s.last_murajaah), "dd MMMM yyyy", { locale: idLocale })}</b>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
