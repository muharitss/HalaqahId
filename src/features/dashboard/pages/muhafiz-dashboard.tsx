import { useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  ClipboardCheck,
  Award,
  ChevronRight,
  Calendar,
  TrendingUp,
  HelpCircle,
  Trophy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMuhafizDashboard } from "../hooks/useMuhafizDashboard";
import { ActivityChart } from "../components/ActivityChart";
import { AttendanceDonutChart } from "../components/AttendanceDonutChart";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useTour } from "@/hooks/useTour";
import { type DriveStep } from "driver.js";
import { Term } from "@/components/ui/Term";
import { useTerminology } from "@/hooks/useTerminology";

import { useQuery } from "@tanstack/react-query";
import { pengumumanService } from "@/features/pengumuman";
import { PengumumanRecentCard, type PengumumanItem } from "../components/PengumumanRecentCard";

interface RecentSetoranItem {
  id_setoran: number;
  santriName?: string;
  tanggal_setoran: string;
  juz: number;
  surat: string | number;
  ayat: string | number;
  taqwim: number;
  keterangan?: string;
  kategori?: { nama_kategori?: string } | string;
}

export function MuhafizDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const labelSantri = useTerminology("SANTRI");
  const labelHalaqah = useTerminology("HALAQAH");
  const labelMuhafiz = useTerminology("MUHAFIZ");

  const {
    isLoading,
    halaqahName,
    progresData,
    todayAttendanceStats,
    absensiStats,
    totalAbsensi,
    recentSetorans,
    weeklySetoranCount,
    weeklyChartData,
    monthlyChartData,
    targetAchievedCount,
    chartView,
    setChartView,
    absensiView,
    setAbsensiView,
  } = useMuhafizDashboard();

  // Fetch active announcements/notifications
  const { data: pengumumanList = [], isLoading: isPengumumanLoading } = useQuery<PengumumanItem[]>({
    queryKey: ["muhafiz-dashboard-pengumuman"],
    queryFn: async () => {
      try {
        const res = await pengumumanService.getPengumumanList({ active_only: true });
        return (res?.data || []) as PengumumanItem[];
      } catch {
        return [];
      }
    },
  });

  const steps: DriveStep[] = [
    {
      element: '[data-tour="dashboard-header"]',
      popover: {
        title: `Dashboard ${labelMuhafiz}`,
        description: `Selamat datang di halaman utama Anda! Pantau perkembangan hafalan dan kehadiran ${labelSantri.toLowerCase()} secara cepat.`,
        side: "bottom",
        align: "start"
      }
    },
    {
      element: '[data-tour="dashboard-actions"]',
      popover: {
        title: "Aksi Cepat",
        description: `Gunakan tombol ini untuk mencatat kehadiran ${labelHalaqah.toLowerCase()} atau merekam setoran hafalan baru ${labelSantri.toLowerCase()} Anda secara langsung.`,
        side: "bottom",
        align: "end"
      }
    },
    {
      element: '[data-tour="dashboard-kpis"]',
      popover: {
        title: "Statistik Utama",
        description: `Pantau jumlah ${labelSantri.toLowerCase()} aktif, persentase kehadiran hari ini, jumlah setoran pekan ini, dan pencapaian target hafalan.`,
        side: "bottom",
        align: "center"
      }
    },
    {
      element: '[data-tour="dashboard-charts"]',
      popover: {
        title: "Visualisasi Grafik",
        description: `Analisis grafik aktivitas setoran pekan/bulanan serta diagram lingkaran kehadiran ${labelHalaqah.toLowerCase()} Anda.`,
        side: "top",
        align: "center"
      }
    },
    {
      element: '[data-tour="dashboard-progress"]',
      popover: {
        title: `Progres Target ${labelSantri}`,
        description: `Lihat daftar capaian real-time ${labelSantri.toLowerCase()} Anda terhadap target hafalan sekolah untuk memastikan kelancaran belajar.`,
        side: "top",
        align: "start"
      }
    }
  ];

  const { restartTour } = useTour({
    tourKey: "tour_muhafiz_dashboard",
    steps,
    userId: user?.id_user,
    autoStart: true,
    ready: !isLoading,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "TERCAPAI":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "DALAM_PROSES":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "BELUM_MULAI":
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
      case "BEBAS":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  const getCategoryColor = (category: string) => {
    const cat = category.toUpperCase();
    if (cat.includes("ZIYADAH")) return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    if (cat.includes("MURAJAAH")) return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
    if (cat.includes("HAFALAN")) return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    if (cat.includes("BACAAN")) return "bg-sky-500/10 text-sky-500 border-sky-500/20";
    return "bg-purple-500/10 text-purple-500 border-purple-500/20";
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
        
        {/* KPI Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mt-1" />
                <Skeleton className="h-3 w-32 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-3 h-80 rounded-xl bg-muted" />
          <div className="lg:col-span-2 h-80 rounded-xl bg-muted" />
        </div>

        {/* Lists Skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-96 rounded-xl bg-muted" />
          <div className="h-96 rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div data-tour="dashboard-header">
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-0">
              Dashboard <Term code="MUHAFIZ" />
            </h3>
            <Button
              onClick={restartTour}
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-primary rounded-full"
              title="Mulai Panduan Dashboard"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1 mb-0">
            Kelola perkembangan setoran hafalan dan kehadiran {labelSantri.toLowerCase()} di {labelHalaqah.toLowerCase()}{" "}
            <span className="font-semibold text-foreground">{halaqahName}</span>
          </p>
        </div>
        <div className="flex items-center gap-2" data-tour="dashboard-actions">
          <Button
            onClick={() => navigate("/muhafidz/absensi")}
            variant="outline"
            size="sm"
          >
            <ClipboardCheck className="mr-2 h-4 w-4" />
            Catat Kehadiran
          </Button>
          <Button
            onClick={() => navigate("/muhafidz/setoran")}
            size="sm"
            className="mr-2"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Catat Setoran
          </Button>
          <Button
            onClick={() => navigate("/muhafidz/leaderboard")}
            variant="outline"
            size="sm"
          >
            <Trophy className="mr-2 h-4 w-4 text-yellow-500" />
            Leaderboard
          </Button>
        </div>
      </div>

      {/* 2. KPI CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-tour="dashboard-kpis">
        {/* CARD 1: TOTAL SANTRI */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total <Term code="SANTRI" /></CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progresData.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Aktif di {labelHalaqah.toLowerCase()} ini</p>
          </CardContent>
        </Card>

        {/* CARD 2: KEHADIRAN HARI INI */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kehadiran Hari Ini</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAttendanceStats.percentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {todayAttendanceStats.present} dari {todayAttendanceStats.total} {labelSantri.toLowerCase()} hadir
            </p>
          </CardContent>
        </Card>

        {/* CARD 3: SETORAN PEKAN INI */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Setoran Pekan Ini</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklySetoranCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Total riwayat hafalan tercatat</p>
          </CardContent>
        </Card>

        {/* CARD 4: TARGET TERCAPAI */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target Tercapai</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{targetAchievedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {targetAchievedCount} dari {progresData.length} {labelSantri.toLowerCase()} tuntas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ANNOUNCEMENT CARD (IF ACTIVE) */}
      <PengumumanRecentCard items={pengumumanList} isLoading={isPengumumanLoading} />

      {/* 3. CHARTS SECTION */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5" data-tour="dashboard-charts">
        <ActivityChart
          dataPekan={weeklyChartData}
          dataBulan={monthlyChartData}
          view={chartView}
          onViewChange={setChartView}
          loading={false}
        />
        <AttendanceDonutChart
          data={absensiStats}
          loading={false}
          totalCount={totalAbsensi}
          view={absensiView}
          onViewChange={setAbsensiView}
        />
      </div>

      {/* 4. BOTTOM SECTION: STUDENT PROGRESS & RECENT ACTIVITY */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* COLUMN 1: STUDENT PROGRESS */}
        <Card data-tour="dashboard-progress">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Progres Target Santri
              </CardTitle>
              <CardDescription className="text-xs">
                Capaian real-time terhadap target sekolah
              </CardDescription>
            </div>
            <Button
              onClick={() => navigate("/muhafidz/progres")}
              variant="ghost"
              size="sm"
              className="text-xs font-semibold gap-1"
            >
              Lihat Semua
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {progresData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-sm">
                <Users className="h-10 w-10 text-muted-foreground/30 mb-3" />
                Belum ada data progres santri
              </div>
            ) : (
              <div className="divide-y max-h-[300px] sm:max-h-[400px] overflow-y-auto scrollbar-thin">
                {progresData.map((item) => (
                  <div
                    key={item.id_santri}
                    className="px-4 py-2.5 hover:bg-muted/30 transition-colors duration-200 flex items-center justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate">{item.nama_santri}</p>
                      <p className="text-[10px] text-muted-foreground truncate mt-0">
                        Target: {item.target?.nama_target || "Bebas"} • {item.progres?.capaian} {item.progres?.satuan} ({item.progres?.persentase || 0}%)
                      </p>
                    </div>
                    <Badge className={`border text-[9px] font-semibold tracking-wide uppercase shrink-0 ${getStatusColor(item.progres?.status)}`}>
                      {item.progres?.status?.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* COLUMN 2: RECENT SETORAN FEED */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
            <div className="space-y-1">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Setoran Terbaru
              </CardTitle>
              <CardDescription className="text-xs">
                Log 5 setoran hafalan terakhir di halaqah
              </CardDescription>
            </div>
            <Button
              onClick={() => navigate("/muhafidz/setoran")}
              variant="ghost"
              size="sm"
              className="text-xs font-semibold gap-1"
            >
              Detail Setoran
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentSetorans.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-sm">
                <BookOpen className="h-10 w-10 text-muted-foreground/30 mb-3" />
                Belum ada setoran masuk pekan ini
              </div>
            ) : (
              <div className="divide-y max-h-[250px] sm:max-h-[400px] overflow-y-auto scrollbar-thin">
                {recentSetorans.map((setoran: RecentSetoranItem) => (
                  <div
                    key={setoran.id_setoran}
                    className="p-4 hover:bg-muted/30 transition-colors duration-200 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">
                          {setoran.santriName}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[9px] px-1.5 py-0.5 font-bold tracking-wide uppercase ${getCategoryColor(
                            typeof setoran.kategori === "string"
                              ? setoran.kategori
                              : (setoran.kategori as { nama_kategori?: string } | undefined)?.nama_kategori || ""
                          )}`}
                        >
                          {typeof setoran.kategori === "string"
                            ? setoran.kategori || "Hafalan"
                            : (setoran.kategori as { nama_kategori?: string } | undefined)?.nama_kategori || "Hafalan"}
                        </Badge>
                      </div>

                      <div className="text-xs text-muted-foreground flex flex-col gap-0.5">
                        <p>
                          Juz {setoran.juz} • {setoran.surat} : {setoran.ayat}
                        </p>
                        {setoran.keterangan && (
                          <p className="text-[10px] italic text-muted-foreground/90">
                            {setoran.keterangan}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-[10px] text-muted-foreground shrink-0 text-right flex flex-col items-end gap-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(setoran.tanggal_setoran), "dd MMM yyyy", { locale: id })}
                      </span>
                      {setoran.taqwim > 0 && (
                        <span className="inline-flex items-center rounded-full bg-rose-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-rose-500">
                          {setoran.taqwim} kesalahan
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
