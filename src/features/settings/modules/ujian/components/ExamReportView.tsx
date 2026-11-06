import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ujianService, type ExamSchedule } from "@/features/setoran/api/ujian-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Users,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BarChart3,
  Award,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface ExamReportViewProps {
  schedules: ExamSchedule[];
}

export function ExamReportView({ schedules }: ExamReportViewProps) {
  const [selectedJadwalId, setSelectedJadwalId] = useState<string>("ALL");
  const [filterLulus, setFilterLulus] = useState<"ALL" | "LULUS" | "TIDAK_LULUS">("ALL");

  const queryParams = useMemo(() => {
    return {
      id_jadwal: selectedJadwalId === "ALL" ? undefined : Number(selectedJadwalId),
      is_lulus:
        filterLulus === "ALL"
          ? undefined
          : filterLulus === "LULUS"
          ? true
          : false,
    };
  }, [selectedJadwalId, filterLulus]);

  const { data: reportData, isLoading } = useQuery({
    queryKey: ["exam-report", queryParams],
    queryFn: async () => {
      const res = await ujianService.getExamReport(queryParams);
      return res.data;
    },
  });

  const results = reportData?.results || [];
  const summary = reportData?.summary;

  // Analisis Perbandingan Rubrik
  const rubrikComparison = useMemo(() => {
    const kriteriaMap: Record<
      string,
      {
        nama: string;
        bobot: number;
        skalaMax: number;
        scores: number[];
      }
    > = {};

    results.forEach((r: any) => {
      const nrList = r.nilai_rubrik || [];
      nrList.forEach((nr: any) => {
        const kId = nr.id_kriteria?.toString() || nr.kriteria?.nama || "Unknown";
        const nama = nr.kriteria?.nama || `Kriteria #${nr.id_kriteria}`;
        const bobot = nr.kriteria?.bobot || 0;
        const skalaMax = nr.kriteria?.skala_max > 0 ? nr.kriteria.skala_max : 100;

        if (!kriteriaMap[kId]) {
          kriteriaMap[kId] = {
            nama,
            bobot,
            skalaMax,
            scores: [],
          };
        }
        kriteriaMap[kId].scores.push(Number(nr.nilai) || 0);
      });
    });

    const entries = Object.values(kriteriaMap).map((item) => {
      const total = item.scores.reduce((a, b) => a + b, 0);
      const avg = item.scores.length > 0 ? total / item.scores.length : 0;
      const pct = item.skalaMax > 0 ? (avg / item.skalaMax) * 100 : 0;
      const min = item.scores.length > 0 ? Math.min(...item.scores) : 0;
      const max = item.scores.length > 0 ? Math.max(...item.scores) : 0;

      return {
        nama: item.nama,
        bobot: item.bobot,
        skalaMax: item.skalaMax,
        count: item.scores.length,
        avgScore: Number(avg.toFixed(1)),
        avgPercentage: Math.round(pct),
        minScore: min,
        maxScore: max,
      };
    });

    // Sort by percentage descending
    entries.sort((a, b) => b.avgPercentage - a.avgPercentage);

    return entries;
  }, [results]);

  return (
    <div className="space-y-6">
      {/* ── HEADER & FILTERS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Laporan & Rekapitulasi Ujian
          </h3>
          <p className="text-xs text-muted-foreground">
            Analisis capaian nilai kelulusan dan perbandingan kriteria rubrik
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Jadwal */}
          <Select value={selectedJadwalId} onValueChange={setSelectedJadwalId}>
            <SelectTrigger className="w-[180px] h-8 text-xs">
              <SelectValue placeholder="Pilih Sesi Ujian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Sesi Ujian</SelectItem>
              {schedules.map((s) => (
                <SelectItem key={s.id_jadwal} value={s.id_jadwal.toString()}>
                  {s.judul_jadwal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filter Kelulusan */}
          <Select
            value={filterLulus}
            onValueChange={(v) => setFilterLulus(v as "ALL" | "LULUS" | "TIDAK_LULUS")}
          >
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Status Kelulusan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Status</SelectItem>
              <SelectItem value="LULUS">Lulus</SelectItem>
              <SelectItem value="TIDAK_LULUS">Tidak Lulus</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── SUMMARY KPIS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Peserta</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold">{summary?.total_peserta ?? results.length}</div>
            )}
            <p className="text-[10px] text-muted-foreground mt-0.5">Santri teruji</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Persentase Kelulusan</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold text-emerald-600">
                {summary?.persentase_kelulusan ?? 0}%
              </div>
            )}
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {summary?.lulus ?? 0} santri lulus
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Tidak Lulus</CardTitle>
            <XCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold text-rose-600">
                {summary?.tidak_lulus ?? 0}
              </div>
            )}
            <p className="text-[10px] text-muted-foreground mt-0.5">Perlu remedial</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Rata-rata Nilai</CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold text-primary">
                {summary?.rata_rata_nilai ?? 0}
              </div>
            )}
            <p className="text-[10px] text-muted-foreground mt-0.5">Skala 0 - 100</p>
          </CardContent>
        </Card>
      </div>

      {/* ── PERBANDINGAN RUBRIK SECTION ── */}
      {rubrikComparison.length > 0 && (
        <Card className="shadow-xs border-primary/20">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Perbandingan Capaian Kriteria Rubrik
                </CardTitle>
                <CardDescription className="text-xs">
                  Rata-rata capaian peserta per kriteria penilaian untuk evaluasi kurikulum
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20 font-bold">
                {rubrikComparison.length} Kriteria
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-3">
              {rubrikComparison.map((item) => (
                <div key={item.nama} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{item.nama}</span>
                      {item.bobot > 0 && (
                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.2 rounded font-medium">
                          Bobot {item.bobot}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-[11px]">
                        Rata-rata: <strong>{item.avgScore}</strong> / {item.skalaMax}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold ${
                          item.avgPercentage >= 80
                            ? "bg-emerald-500/10 text-emerald-700 border-emerald-300 dark:text-emerald-400"
                            : item.avgPercentage >= 60
                            ? "bg-amber-500/10 text-amber-700 border-amber-300 dark:text-amber-400"
                            : "bg-rose-500/10 text-rose-700 border-rose-300 dark:text-rose-400"
                        }`}
                      >
                        {item.avgPercentage}%
                      </Badge>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.avgPercentage >= 80
                          ? "bg-emerald-500"
                          : item.avgPercentage >= 60
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, item.avgPercentage))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── HASIL UJIAN SANTRI TABLE ── */}
      <Card className="shadow-xs overflow-hidden">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-sm font-semibold">Daftar Hasil Penilaian Santri</CardTitle>
          <CardDescription className="text-xs">
            Rincian nilai per santri pada sesi ujian yang dipilih
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              Tidak ada data hasil ujian yang sesuai filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-xs">Nama Santri</TableHead>
                    <TableHead className="text-xs">Halaqah</TableHead>
                    <TableHead className="text-xs">Sesi Ujian</TableHead>
                    <TableHead className="text-xs text-center">Nilai Akhir</TableHead>
                    <TableHead className="text-xs">Predikat</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs text-right">Tanggal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((r: any) => {
                    const isLulus = r.is_lulus;
                    let dateStr = "";
                    try {
                      dateStr = format(new Date(r.created_at), "dd/MM/yyyy", { locale: idLocale });
                    } catch {
                      dateStr = r.created_at;
                    }

                    return (
                      <TableRow key={r.id_hasil || r.id_sesi_ujian} className="hover:bg-muted/10">
                        <TableCell className="text-xs font-semibold text-foreground">
                          {r.santri?.nama_santri || `Santri #${r.id_santri}`}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {r.santri?.halaqah?.name_halaqah || "-"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {r.jadwal?.judul_jadwal || r.jadwal?.template?.nama_template || "Ujian"}
                        </TableCell>
                        <TableCell className="text-xs text-center font-extrabold text-primary">
                          {r.nilai_akhir ?? "—"}
                        </TableCell>
                        <TableCell className="text-xs">
                          <Badge variant="outline" className="text-[10px]">
                            {r.predikat || "DRAFT"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {isLulus ? (
                            <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-300 text-[10px] gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Lulus
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-[10px] gap-1">
                              <XCircle className="h-3 w-3" /> Tidak Lulus
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-right text-muted-foreground">
                          {dateStr}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
