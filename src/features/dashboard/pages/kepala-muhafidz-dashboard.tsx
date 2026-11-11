import { useMemo } from "react";
import { format } from "date-fns";
import { ActivityChart } from "../components/ActivityChart";
import { AttendanceDonutChart } from "../components/AttendanceDonutChart";
import { JuzDistributionChart } from "../components/JuzDistributionChart";
import { KepalaMuhafidzKpiCards } from "../components/KepalaMuhafidzKpiCards";
import { AlfaStudentsTableCard } from "../components/AlfaStudentsTableCard";
import { RecentSetoranTimelineCard } from "../components/RecentSetoranTimelineCard";
import { LaporanChartSection } from "@/features/setoran/modules/laporan";
import { useDashboardData } from "../hooks/useDashboardData";
import { Trophy, BookOpen } from "lucide-react";
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
    <div className="w-full space-y-6">
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-0">
            Dashboard Kepala <Term code="MUHAFIZ" />
          </h3>
          <p className="text-sm text-muted-foreground mt-1 mb-0">
            Kelola {labelHalaqah.toLowerCase()}, {labelSantri.toLowerCase()}, dan pantau capaian setoran secara terpusat.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate("/kepala-muhafidz/leaderboard")}
            variant="outline"
            size="sm"
            className="shadow-sm h-9"
          >
            <Trophy className="mr-2 h-4 w-4 text-yellow-500" />
            Leaderboard
          </Button>
          <Button
            onClick={() => navigate("/kepala-muhafidz/progress")}
            size="sm"
            className="shadow-sm h-9"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Peta Hafalan
          </Button>
        </div>
      </div>

      {/* ── ROW 1: 4 STAT KPI CARDS ──────────────────────────────────────── */}
      <KepalaMuhafidzKpiCards
        avgJuz={avgJuz}
        activeSetorCount={activeSetorCount}
        totalSantri={juzDistribution.total_santri || 0}
        todaySetoranCount={todaySetoranCount}
        todayAttendance={todayAttendance}
        isLoading={loading.setoran || loading.absensi || loading.juz}
      />

      {/* ── ROW 2: 3 CHART CARDS IN A ROW ────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* ── ROW 3: 2 COLUMNS (TABLE 8 COLS + TIMELINE 4 COLS) ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <AlfaStudentsTableCard
            alfaStudents={alfaStudents}
            loading={loading.alfa}
            alfaView={alfaView}
            onViewChange={setAlfaView}
          />
        </div>
        <div className="lg:col-span-4">
          <RecentSetoranTimelineCard
            setoranList={setoranData}
            todaySetoranCount={todaySetoranCount}
            loading={loading.setoran}
          />
        </div>
      </div>

      {/* ── OPTIONAL: DETAIL DISTRIBUSI LAPORAN SECTION ─────────────────── */}
      {!loading.setoran && stats && (
        <div className="pt-2">
          <LaporanChartSection
            distribusiKategori={stats.distribusiKategori}
            distribusiHalaqah={stats.distribusiHalaqah}
          />
        </div>
      )}
    </div>
  );
}
