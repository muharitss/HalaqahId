import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/components/auth-provider";
import { santriService } from "@/features/santri/api/santriService";
import { progresService } from "@/features/santri/api/progresService";
import { absensiService } from "@/features/absensi/api/absensiService";
import { setoranService } from "@/features/setoran/api/setoranService";
import { dashboardService } from "@/features/dashboard/api/dashboardService";
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
  const { data: santriList = [], isFetching: loadingSantri } = useQuery({
    queryKey: ["muhafiz-dashboard-santri", user?.id_user],
    queryFn: async () => {
      const res = await santriService.getAll();
      return res || [];
    },
    enabled: !!user?.id_user,
  });

  // Halaqah Name derived from student records
  const halaqahName = useMemo(() => {
    if (santriList.length > 0) {
      return santriList[0]?.halaqah?.name_halaqah || "Halaqah Aktif";
    }
    return "Halaqah Aktif";
  }, [santriList]);

  // 2. Fetch Progress List (Auto-filtered by backend)
  const { data: progresData = [], isFetching: loadingProgres } = useQuery({
    queryKey: ["muhafiz-dashboard-progres", user?.id_user],
    queryFn: async () => {
      const res = await progresService.getAllProgres();
      return res.data || [];
    },
    enabled: !!user?.id_user,
  });

  // 3. Fetch Today's Attendance for own halaqah
  const { data: todayAbsensi = [], isFetching: loadingTodayAbsensi } = useQuery({
    queryKey: ["muhafiz-dashboard-today-absensi", user?.id_halaqah, todayStr],
    queryFn: async () => {
      if (!user?.id_halaqah) return [];
      try {
        const res = await absensiService.getDailyHalaqah(user.id_halaqah, todayStr);
        return res.data || [];
      } catch (err) {
        console.error("Gagal memuat absensi hari ini:", err);
        return [];
      }
    },
    enabled: !!user?.id_halaqah,
  });

  // Today's attendance metrics
  const todayAttendanceStats = useMemo(() => {
    const present = todayAbsensi.filter(
      (a) => a.status === "HADIR" || a.status === "TERLAMBAT"
    ).length;
    return {
      present,
      total: todayAbsensi.length,
      percentage: todayAbsensi.length > 0 ? Math.round((present / todayAbsensi.length) * 100) : 0,
    };
  }, [todayAbsensi]);

  // 4. Fetch Monthly Attendance Rekap
  const { data: monthlyAbsensi = [], isFetching: loadingMonthlyAbsensi } = useQuery({
    queryKey: ["muhafiz-dashboard-monthly-absensi", user?.id_halaqah, currentMonth, currentYear],
    queryFn: async () => {
      if (!user?.id_halaqah) return [];
      try {
        const res = await absensiService.getRekapHalaqah(
          user.id_halaqah,
          undefined,
          currentMonth,
          currentYear
        );
        return (res.data as any[]) || [];
      } catch (err) {
        console.error("Gagal memuat rekap bulanan absensi:", err);
        return [];
      }
    },
    enabled: !!user?.id_halaqah,
  });

  // Parse and calculate attendance stats based on selected view (pekan / bulan)
  const parsedAbsensiStats = useMemo(() => {
    const counts = { HADIR: 0, IZIN: 0, SAKIT: 0, TERLAMBAT: 0, ALFA: 0 };
    const now = new Date();

    const rangeStart = absensiView === "pekan"
      ? startOfWeek(now, { weekStartsOn: 1 })
      : startOfMonth(now);

    monthlyAbsensi.forEach((day: any) => {
      const dayDate = new Date(day.tanggal);
      const inRange = absensiView === "bulan" || (dayDate >= rangeStart && dayDate <= now);

      if (inRange && Array.isArray(day.data)) {
        day.data.forEach((record: any) => {
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
      { status: "TERLAMBAT" as const, count: counts.TERLAMBAT, fill: "#f97316" },
      { status: "ALFA" as const, count: counts.ALFA, fill: "#ef4444" },
    ];

    const total = Object.values(counts).reduce((sum, val) => sum + val, 0);

    return { stats, total };
  }, [monthlyAbsensi, absensiView]);

  // 5. Fetch Setoran records for all students in the halaqah via bulk query
  const { data: setoranHistory = [], isFetching: loadingSetoran } = useQuery({
    queryKey: ["muhafiz-dashboard-setoran", user?.id_user],
    queryFn: async () => {
      try {
        const res = await setoranService.getAllSetoran(1, 1000);
        return (res.data || []).map((item: any) => ({
          ...item,
          id_setoran: item.id_setoran,
          santriName: item.santri?.nama_santri,
        }));
      } catch (err) {
        console.error("Gagal mengambil data setoran massal:", err);
        return [];
      }
    },
    enabled: !!user?.id_user,
  });

  // Calculate stats from setoran data
  const setoranStats = useMemo(() => {
    const now = new Date();
    const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 });

    const weeklyCount = setoranHistory.filter(
      (s) => new Date(s.tanggal_setoran) >= startOfCurrentWeek
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
    })) as any;

    const weeklyChartData = dashboardService.getWeeklyChartData(chartDataFormat);
    const monthlyChartData = dashboardService.getMonthlyChartData(chartDataFormat);

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
