
import { absensiService } from "@/features/muhafidz/absensi/services/absensiService";
import { setoranService } from "@/features/muhafidz/setoran/services/setoranService";
import { santriService } from "@/features/muhafidz/kelola-santri/services/santriService";
import { sanitizeDashboardData } from "@/lib/dataTransformer";
import { startOfWeek, startOfMonth, eachDayOfInterval, format } from "date-fns";
import type { AbsensiStat, PekanData, BulanData, CategoryStat } from "../types";

export const dashboardService = {
  // Get all muhafiz for table
  getMuhafizList: async () => {
    try {
      const res = await akunService.getAllMuhafiz();
      return res || [];
    } catch (error) {
      console.error("Gagal mengambil data muhafiz:", error);
      return [];
    }
  },

  // Get all setoran data
  getAllSetoran: async () => {
    try {
      const res = await setoranService.getAllSetoran();
      return res.data || [];
    } catch (error) {
      console.error("Gagal mengambil data setoran:", error);
      return [];
    }
  },

  // Get aggregated attendance data
  getAttendanceStats: async (view: "pekan" | "bulan"): Promise<{ stats: AbsensiStat[]; total: number }> => {
    try {
      const now = new Date();
      const start = view === "pekan" 
        ? startOfWeek(now, { weekStartsOn: 1 }) 
        : startOfMonth(now);
      
      const dates = eachDayOfInterval({ start, end: now }).map(d => format(d, "yyyy-MM-dd"));
      const resHalaqah = await halaqahService.getAllHalaqah();
      const allHalaqah = resHalaqah || [];

      // Fetch data paralel per tanggal dan per halaqah
      const promises = dates.flatMap(date => 
        allHalaqah.map((h: any) => 
          absensiService.getRekapHalaqah(h.id_halaqah, date)
            .then(res => res.data || [])
            .catch(() => [])
        )
      );

      const results = await Promise.all(promises);
      const rawData = results.flat();

      // Bersihkan data
      const cleanData = sanitizeDashboardData(rawData);

      const counts = { HADIR: 0, IZIN: 0, SAKIT: 0, ALFA: 0, TERLAMBAT: 0 };
      cleanData.forEach((item: any) => {
        const status = item.status as keyof typeof counts;
        if (status in counts) {
          counts[status]++;
        }
      });

      const stats = [
        { status: "HADIR", count: counts.HADIR, fill: "#22c55e" },
        { status: "IZIN", count: counts.IZIN, fill: "#3b82f6" },
        { status: "SAKIT", count: counts.SAKIT, fill: "#eab308" },
        { status: "TERLAMBAT", count: counts.TERLAMBAT, fill: "#f97316" },
        { status: "ALFA", count: counts.ALFA, fill: "#ef4444" },
      ];

      return { stats, total: cleanData.length };
    } catch (error) {
      console.error("Gagal agregasi absensi:", error);
      return { stats: [], total: 0 };
    }
  },

  // Get weekly chart data
  getWeeklyChartData: (setoranData: any[]): PekanData[] => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const counts: Record<string, number> = {};
    days.forEach(d => counts[d] = 0);
    
    const cleanSetoran = sanitizeDashboardData(setoranData);
    
    cleanSetoran.forEach((s: any) => {
      const d = new Date(s.tanggal_setoran!);
      if (d >= start) {
        const idx = d.getDay() === 0 ? 6 : d.getDay() - 1;
        counts[days[idx]]++;
      }
    });
    
    return days.map(day => ({ day, setoran: counts[day] }));
  },

  // Get monthly chart data
  getMonthlyChartData: (setoranData: any[]): BulanData[] => {
    const start = startOfMonth(new Date());
    const lastDay = new Date().getDate();
    const dayCounts: Record<number, number> = {};
    for (let i = 1; i <= lastDay; i++) dayCounts[i] = 0;
    
    const cleanSetoran = sanitizeDashboardData(setoranData);
    
    cleanSetoran.forEach((s: any) => {
      const d = new Date(s.tanggal_setoran!);
      if (d >= start) dayCounts[d.getDate()]++;
    });
    
    return Object.keys(dayCounts).map(date => ({ 
      date: `Tgl ${date}`, 
      setoran: dayCounts[parseInt(date)] 
    }));
  },

  // Get category distribution
  getCategoryDistribution: (setoranData: any[]): CategoryStat[] => {
    const cleanSetoran = sanitizeDashboardData(setoranData);
    
    const hafalan = cleanSetoran.filter((s: any) => s.kategori === "HAFALAN").length;
    const murajaah = cleanSetoran.filter((s: any) => s.kategori === "MURAJAAH").length;
    const ziyadah = cleanSetoran.filter((s: any) => s.kategori === "ZIYADAH").length;
    const intens = cleanSetoran.filter((s: any) => s.kategori === "INTENS").length;
    const bacaan = cleanSetoran.filter((s: any) => s.kategori === "BACAAN").length;
    
    return [
      { category: "hafalan", count: hafalan },
      { category: "murajaah", count: murajaah },
      { category: "ziyadah", count: ziyadah },
      { category: "intens", count: intens },
      { category: "bacaan", count: bacaan },
    ];
  },

  // Get dashboard stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const [santriRes, muhafizRes, halaqahRes, setoranRes] = await Promise.all([
        santriService.getAll(),
        akunService.getAllMuhafiz(),
        halaqahService.getAllHalaqah(),
        setoranService.getAllSetoran()
      ]);

      return {
        totalSantri: santriRes.length || 0,
        totalMuhafiz: muhafizRes.length || 0,
        totalHalaqah: halaqahRes.length || 0,
        totalSetoran: setoranRes.data?.length || 0
      };
    } catch (error) {
      console.error("Gagal mengambil stats dashboard:", error);
      return {
        totalSantri: 0,
        totalMuhafiz: 0,
        totalHalaqah: 0,
        totalSetoran: 0
      };
    }
  }
};

// Import type untuk DashboardStats
import type { DashboardStats } from "../types";
import { akunService, halaqahService } from "@/services";
