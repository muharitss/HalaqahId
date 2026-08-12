import { useState, useMemo } from "react";
import { useAuth } from "@/features/auth/components/auth-provider";
import {
  dashboardService,
  useMuhafizDashboardSantriQuery,
  useMuhafizDashboardProgresQuery,
  useMuhafizDashboardTodayAbsensiQuery,
  useMuhafizDashboardMonthlyAbsensiQuery,
  useMuhafizDashboardSetoranQuery,
} from "@/features/dashboard/api";
import { format, startOfWeek, startOfMonth } from "date-fns";

export type ViewType = "pekan" | "bulan";

export const useMuhafizDashboard = () => {
  const { user } = useAuth();
  const [chartView, setChartView] = useState<ViewType>("pekan");
  const [absensiView, setAbsensiView] = useState<ViewType>("pekan");

  const todayStr = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const currentMonth = useMemo(() => format(new Date(), "MM"), []);
  const currentYear = useMemo(() => format(new Date(), "yyyy"), []);

  // 1. Fetch Santri List (Auto-filtered by backend for Muhafiz own halaqah)
  const { data: santriList = [], isLoading: loadingSantri } = useMuhafizDashboardSantriQuery(user?.id_user);

  // Halaqah Name derived from student records
  const halaqahName = useMemo(() => {
    if (santriList.length > 0) {
      return santriList[0]?.halaqah?.name_halaqah || "Halaqah Aktif";
    }
    return "Halaqah Aktif";
  }, [santriList]);

  // 2. Fetch Progress List (Auto-filtered by backend)
  const { data: progresData = [], isLoading: loadingProgres } = useMuhafizDashboardProgresQuery(user?.id_user);

  // 3. Fetch Today's Attendance for own halaqah
  const { data: todayAbsensi = [], isLoading: loadingTodayAbsensi } = useMuhafizDashboardTodayAbsensiQuery(
    user?.id_halaqah,
    todayStr
  );

  // Today's attendance metrics
  const todayAttendanceStats = useMemo(() => {
    const present = todayAbsensi.filter(
      (a) => a.status === "HADIR" || a.status === "TERLAMBAT",
    ).length;
    // Gunakan jumlah santri aktif (progresData) sebagai total,
    // bukan jumlah record absensi — agar card tidak menampilkan "0 dari 0"
    // ketika sesi belum dimulai / belum ada absensi hari ini.
    const total = progresData.length || todayAbsensi.length;
    return {
      present,
      total,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0,
    };
  }, [todayAbsensi, progresData]);

  // 4. Fetch Monthly Attendance Rekap
  const { data: monthlyAbsensi = [], isLoading: loadingMonthlyAbsensi } = useMuhafizDashboardMonthlyAbsensiQuery(
    user?.id_halaqah,
    currentMonth,
    currentYear
  );

  // Parse and calculate attendance stats based on selected view (pekan / bulan)
  const parsedAbsensiStats = useMemo(() => {
    const counts = { HADIR: 0, IZIN: 0, SAKIT: 0, TERLAMBAT: 0, ALFA: 0 };
    const now = new Date();

    const rangeStart =
      absensiView === "pekan"
        ? startOfWeek(now, { weekStartsOn: 1 })
        : startOfMonth(now);

    monthlyAbsensi.forEach((day: { tanggal: string; data?: Array<{ status: string }> }) => {
      const dayDate = new Date(day.tanggal);
      const inRange =
        absensiView === "bulan" || (dayDate >= rangeStart && dayDate <= now);

      if (inRange && Array.isArray(day.data)) {
        day.data.forEach((record) => {
          const status = record.status as keyof typeof counts;
          if (status in counts) {
            counts[status]++;
          }
        });
      }
    });

    const stats = [
      { status: "HADIR" as const, count: counts.HADIR, fill: "#22c55e" },
      { status: "IZIN" as const, count: counts.IZIN, fill: "#3b82f6" },
      { status: "SAKIT" as const, count: counts.SAKIT, fill: "#eab308" },
      {
        status: "TERLAMBAT" as const,
        count: counts.TERLAMBAT,
        fill: "#f97316",
      },
      { status: "ALFA" as const, count: counts.ALFA, fill: "#ef4444" },
    ];

    const total = Object.values(counts).reduce((sum, val) => sum + val, 0);

    return { stats, total };
  }, [monthlyAbsensi, absensiView]);

  // 5. Fetch Setoran records for all students in the halaqah via bulk query
  const { data: setoranHistory = [], isLoading: loadingSetoran } = useMuhafizDashboardSetoranQuery(user?.id_user);

  // Calculate stats from setoran data
  const setoranStats = useMemo(() => {
    const now = new Date();
    const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 });

    const weeklyCount = setoranHistory.filter(
      (s) => new Date(s.tanggal_setoran) >= startOfCurrentWeek,
    ).length;

    // Adapt setoranHistory structure to match SetoranData needed by dashboardService chart methods
    const chartDataFormat = setoranHistory.map((s) => ({
      id_setoran: s.id_setoran,
      id_santri: s.id_santri,
      tanggal_setoran: s.tanggal_setoran,
      kategori: s.kategori?.nama_kategori || s.kategori || "",
      santri: {
        id_santri: s.id_santri,
        nama_santri: s.santriName,
      },
    }));

    const weeklyChartData =
      dashboardService.getWeeklyChartData(chartDataFormat as unknown as Parameters<typeof dashboardService.getWeeklyChartData>[0]);
    const monthlyChartData =
      dashboardService.getMonthlyChartData(chartDataFormat as unknown as Parameters<typeof dashboardService.getMonthlyChartData>[0]);

    return {
      weeklyCount,
      weeklyChartData,
      monthlyChartData,
    };
  }, [setoranHistory]);

  // Count target achieved stats
  const targetAchievedCount = useMemo(() => {
    return progresData.filter((p) => p.progres?.status === "TERCAPAI").length;
  }, [progresData]);

  const isLoading =
    loadingSantri ||
    loadingProgres ||
    loadingTodayAbsensi ||
    loadingMonthlyAbsensi ||
    loadingSetoran;

  return {
    isLoading,
    halaqahName,
    santriList,
    progresData,
    todayAttendanceStats,
    absensiStats: parsedAbsensiStats.stats,
    totalAbsensi: parsedAbsensiStats.total,
    recentSetorans: setoranHistory.slice(0, 5), // Latest 5 recitations
    weeklySetoranCount: setoranStats.weeklyCount,
    weeklyChartData: setoranStats.weeklyChartData,
    monthlyChartData: setoranStats.monthlyChartData,
    targetAchievedCount,
    chartView,
    setChartView,
    absensiView,
    setAbsensiView,
  };
};
