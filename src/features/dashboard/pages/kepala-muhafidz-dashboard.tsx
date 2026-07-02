import { ActivityChart } from "../components/ActivityChart";
import { AttendanceDonutChart } from "../components/AttendanceDonutChart";
import { useDashboardData } from "../hooks/useDashboardData";

export function KepalaMuhafidzDashboard() {
  const {
    loading,
    chartView,
    setChartView,
    absensiView,
    setAbsensiView,
    weeklyData,
    monthlyData,
    absensiStats,
    totalAbsensi,
  } = useDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Kepala Muhafiz</h1>
        <p className="text-muted-foreground">
          Kelola halaqah, santri, dan laporan secara terpusat
        </p>
      </div>

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
      </div>
    </div>
  );
}
