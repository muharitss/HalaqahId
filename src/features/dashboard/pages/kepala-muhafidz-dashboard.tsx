import { useMemo } from "react";
import { format } from "date-fns";
import { ActivityChart } from "../components/ActivityChart";
import { AttendanceDonutChart } from "../components/AttendanceDonutChart";
import { JuzDistributionChart } from "../components/JuzDistributionChart";
import { KepalaMuhafidzKpiCards } from "../components/KepalaMuhafidzKpiCards";
import { LaporanChartSection } from "@/features/setoran/modules/laporan";
import { useDashboardData } from "../hooks/useDashboardData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserX, Trophy, BookOpen, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Term } from "@/components/ui/Term";
import { useTerminology } from "@/hooks/useTerminology";
import { Button } from "@/components/ui/button";

export function KepalaMuhafidzDashboard() {
  const navigate = useNavigate();
  const labelSantri = useTerminology("SANTRI");
  const labelHalaqah = useTerminology("HALAQAH");

  const {
    loading,
    chartView,
    setChartView,
    absensiView,
    setAbsensiView,
    alfaView,
    setAlfaView,
    weeklyData,
    monthlyData,
    absensiStats,
    totalAbsensi,
    alfaStudents,
    stats,
    setoranData,
    juzDistribution,
  } = useDashboardData();

  const todayStr = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

  const todaySetoranCount = useMemo(() => {
    return (setoranData || []).filter((s) => {
      const d = s.tanggal_setoran ? new Date(s.tanggal_setoran).toISOString().split("T")[0] : "";
      return d === todayStr;
    }).length;
  }, [setoranData, todayStr]);

  const { avgJuz, activeSetorCount } = useMemo(() => {
    const totalSantri = juzDistribution.total_santri || 0;
    const belum = juzDistribution.belum_setoran || 0;
    const totalJuzSum = (juzDistribution.distribution || []).reduce(
      (sum, item) => sum + item.juz * item.total_santri,
      0
    );
    const avg = totalSantri > 0 ? (totalJuzSum / totalSantri).toFixed(1) : "0.0";
    return {
      avgJuz: avg,
      activeSetorCount: Math.max(0, totalSantri - belum),
    };
  }, [juzDistribution]);

  const todayAttendance = useMemo(() => {
    const hadir = absensiStats.find((s) => s.status === "HADIR")?.count || 0;
    const total = totalAbsensi || 0;
    const pct = total > 0 ? Math.round((hadir / total) * 100) : 0;
    return { hadir, total, percentage: pct };
  }, [absensiStats, totalAbsensi]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Kepala <Term code="MUHAFIZ" /></h1>
          <p className="text-muted-foreground">
            Kelola {labelHalaqah.toLowerCase()}, {labelSantri.toLowerCase()}, dan laporan secara terpusat
          </p>
        </div>
        <Button
          onClick={() => navigate("/kepala-muhafidz/leaderboard")}
          variant="outline"
          size="sm"
          className="shadow-sm"
        >
          <Trophy className="mr-2 h-4 w-4 text-yellow-500" />
          Lihat Leaderboard
        </Button>
      </div>

      {/* KPI Cards: Progress Hafalan Rata-Rata, Absensi Hari Ini, Setoran Hari Ini, Total Santri */}
      <KepalaMuhafidzKpiCards
        avgJuz={avgJuz}
        activeSetorCount={activeSetorCount}
        totalSantri={juzDistribution.total_santri || 0}
        todaySetoranCount={todaySetoranCount}
        todayAttendance={todayAttendance}
        isLoading={loading.setoran || loading.absensi || loading.juz}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <ActivityChart
          dataPekan={weeklyData}
          dataBulan={monthlyData}
          view={chartView}
          onViewChange={setChartView}
          loading={loading.setoran}
        />
        <AttendanceDonutChart
          data={absensiStats}
          loading={loading.absensi}
          totalCount={totalAbsensi}
          view={absensiView}
          onViewChange={setAbsensiView}
        />
        <JuzDistributionChart
          distribution={juzDistribution.distribution}
          belumSetoran={juzDistribution.belum_setoran}
          totalSantri={juzDistribution.total_santri}
          loading={loading.juz}
        />
      </div>


      {!loading.setoran && stats && (
        <LaporanChartSection
          distribusiKategori={stats.distribusiKategori}
          distribusiHalaqah={stats.distribusiHalaqah}
        />
      )}

      {/* Widget Ringkasan Progress Hafalan */}
      <Card className="border-primary/20 bg-primary/5 shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Peta Progress Hafalan 114 Surat</h3>
              <p className="text-xs text-muted-foreground">
                Pantau visualisasi capaian 30 Juz dan tingkat ketuntasan hafalan per santri secara komprehensif.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => navigate("/kepala-muhafidz/progress")}
            className="gap-1.5 shrink-0 text-xs"
          >
            Buka Peta Hafalan
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </CardContent>
      </Card>

      {/* 3. ALFA STUDENTS LIST */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <UserX className="h-5 w-5 text-destructive" />
            <div>
              <CardTitle className="text-base font-semibold">Santri Tidak Hadir (Alfa)</CardTitle>
              <CardDescription className="text-xs">
                Daftar santri dengan status Alfa pada periode yang dipilih ({alfaView === "pekan" ? "Pekan Ini" : "Bulan Ini"})
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
            <Button
              variant={alfaView === "pekan" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setAlfaView("pekan")}
              className="text-[11px] h-7 px-2.5 font-medium shadow-none"
            >
              Pekan
            </Button>
            <Button
              variant={alfaView === "bulan" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setAlfaView("bulan")}
              className="text-[11px] h-7 px-2.5 font-medium shadow-none"
            >
              Bulan
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {loading.alfa ? (
            <div className="space-y-2">
              <div className="h-8 bg-muted rounded animate-pulse w-full" />
              <div className="h-8 bg-muted rounded animate-pulse w-full" />
              <div className="h-8 bg-muted rounded animate-pulse w-full" />
            </div>
          ) : alfaStudents.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              Alhamdulillah, tidak ada santri dengan status Alfa pada periode ini.
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/40">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Nama Santri</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Halaqah</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-center">Frekuensi Alfa</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Tanggal Absen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-muted-foreground">
                  {alfaStudents.map((student) => (
                    <tr key={student.id_santri} className="hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-3.5 font-medium text-foreground">{student.nama_santri}</td>
                      <td className="px-4 py-3.5">{student.name_halaqah}</td>
                      <td className="px-4 py-3.5 text-center">
                        <Badge variant="destructive" className="font-semibold text-[10px] py-0.5 tracking-wide uppercase">
                          {student.alfaCount}x Alfa
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 max-w-xs md:max-w-md">
                        <div className="flex flex-wrap gap-1">
                          {student.dates.map((dateStr) => {
                            const date = new Date(dateStr);
                            const formattedDate = isNaN(date.getTime())
                              ? dateStr
                              : date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
                            return (
                              <Badge key={dateStr} variant="outline" className="text-[10px] bg-background">
                                {formattedDate}
                              </Badge>
                            );
                          })}
                        </div>
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
  );
}

