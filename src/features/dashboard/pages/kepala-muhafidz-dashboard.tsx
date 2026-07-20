import { ActivityChart } from "../components/ActivityChart";
import { AttendanceDonutChart } from "../components/AttendanceDonutChart";
import { JuzDistributionChart } from "../components/JuzDistributionChart";
import { LaporanChartSection } from "@/features/setoran/modules/laporan";
import { useDashboardData } from "../hooks/useDashboardData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserX, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function KepalaMuhafidzDashboard() {
  const navigate = useNavigate();
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
    juzDistribution,
  } = useDashboardData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Kepala Muhafiz</h1>
          <p className="text-muted-foreground">
            Kelola halaqah, santri, dan laporan secara terpusat
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

