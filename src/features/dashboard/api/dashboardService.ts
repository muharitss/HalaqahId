import { absensiService } from "@/features/absensi/api/absensiService";
import { setoranService } from "@/features/setoran/api/setoranService";
import { santriService } from "@/features/santri/api/santriService";
import { sanitizeDashboardData } from "@/lib/dataTransformer";
import { startOfWeek, startOfMonth, eachDayOfInterval, format } from "date-fns";
import { akunService, halaqahService } from "@/features/shared/api";

import type { 
  AbsensiStat, 
  PekanData, 
  BulanData, 
  CategoryStat, 
  DashboardStats,
  Muhafiz,
  SetoranData,
  Halaqah,
  AbsensiData
} from "../types";

export const dashboardService = {
  // Get all muhafiz for table
  getMuhafizList: async (): Promise<Muhafiz[]> => {
    try {
      const res = await akunService.getAllMuhafiz();
      // Gunakan 'as unknown as Muhafiz[]' jika strukturnya benar-benar beda jauh
      // tapi secara logika ini akan memaksa data dari akunService menjadi tipe Muhafiz dashboard
      return (res || []) as unknown as Muhafiz[];
    } catch (error) {
      console.error("Gagal mengambil data muhafiz:", error);
      return [];
    }
  },

  // Get all setoran data
  getAllSetoran: async (): Promise<SetoranData[]> => {
    try {
      const res = await setoranService.getAllSetoran();
      // Tambahkan 'as unknown' sebelum 'as SetoranData[]'
      return (res.data || []) as unknown as SetoranData[];
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
      // Cast ke tipe Halaqah dashboard agar properti 'id_halaqah' bisa diakses
      const allHalaqah = (resHalaqah || []) as unknown as Halaqah[];

      const promises = dates.flatMap(date => 
        allHalaqah.map((h) => 
          absensiService.getRekapHalaqah(h.id_halaqah, date)
            .then(res => {
              // Gunakan unknown sebagai jembatan untuk konversi tipe yang tidak overlap
              return (res.data || []) as unknown as AbsensiData[];
            })
            .catch(() => [] as AbsensiData[])
        )
      );

      const results = await Promise.all(promises);
      // Memastikan hasil flat adalah array AbsensiData murni
      const rawData = results.flat() as AbsensiData[];

      const cleanData = sanitizeDashboardData<AbsensiData>(rawData);

      const counts = { HADIR: 0, IZIN: 0, SAKIT: 0, ALFA: 0, TERLAMBAT: 0 };
      cleanData.forEach((item) => {
        const status = item.status as keyof typeof counts;
        if (status in counts) {
          counts[status]++;
        }
      });

      const stats: AbsensiStat[] = [
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

  // Helper Chart Methods (Pastikan argumen menggunakan tipe yang sudah didefinisikan)
  getWeeklyChartData: (setoranData: SetoranData[]): PekanData[] => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const counts: Record<string, number> = {};
    days.forEach(d => counts[d] = 0);
    
    const cleanSetoran = sanitizeDashboardData<SetoranData>(setoranData);
    
    cleanSetoran.forEach((s) => {
      if (s.tanggal_setoran) {
        const d = new Date(s.tanggal_setoran);
        if (d >= start) {
          const idx = d.getDay() === 0 ? 6 : d.getDay() - 1;
          counts[days[idx]]++;
        }
      }
    });
    
    return days.map(day => ({ day, setoran: counts[day] }));
  },

  getMonthlyChartData: (setoranData: SetoranData[]): BulanData[] => {
    const start = startOfMonth(new Date());
    const lastDay = new Date().getDate();
    const dayCounts: Record<number, number> = {};
    for (let i = 1; i <= lastDay; i++) dayCounts[i] = 0;
    
    const cleanSetoran = sanitizeDashboardData<SetoranData>(setoranData);
    
    cleanSetoran.forEach((s) => {
      if (s.tanggal_setoran) {
        const d = new Date(s.tanggal_setoran);
        if (d >= start) dayCounts[d.getDate()]++;
      }
    });
    
    return Object.keys(dayCounts).map(date => {
      const dNum = parseInt(date);
      return { 
        date: `Tgl ${dNum}`, 
        setoran: dayCounts[dNum] 
      };
    });
  },

  getCategoryDistribution: (setoranData: SetoranData[]): CategoryStat[] => {
    const cleanSetoran = sanitizeDashboardData<SetoranData>(setoranData);
    
    const getCount = (cat: string) => cleanSetoran.filter(s => s.kategori === cat).length;
    
    return [
      { category: "hafalan", count: getCount("HAFALAN") },
      { category: "murajaah", count: getCount("MURAJAAH") },
      { category: "ziyadah", count: getCount("ZIYADAH") },
      { category: "intens", count: getCount("INTENS") },
      { category: "bacaan", count: getCount("BACAAN") },
    ];
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const [santriRes, muhafizRes, halaqahRes, setoranRes] = await Promise.all([
        santriService.getAll(),
        akunService.getAllMuhafiz(),
        halaqahService.getAllHalaqah(),
        setoranService.getAllSetoran()
      ]);

      return {
        totalSantri: Array.isArray(santriRes) ? santriRes.length : 0,
        totalMuhafiz: Array.isArray(muhafizRes) ? muhafizRes.length : 0,
        totalHalaqah: Array.isArray(halaqahRes) ? halaqahRes.length : 0,
        totalSetoran: setoranRes.data?.length || 0
      };
    } catch (error) {
      console.error("Gagal mengambil stats dashboard:", error);
      return { totalSantri: 0, totalMuhafiz: 0, totalHalaqah: 0, totalSetoran: 0 };
    }
  }
};
