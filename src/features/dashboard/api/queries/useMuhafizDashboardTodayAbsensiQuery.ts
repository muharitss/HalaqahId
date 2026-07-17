import { useQuery } from "@tanstack/react-query";
import { absensiService } from "@/features/absensi";

export function useMuhafizDashboardTodayAbsensiQuery(idHalaqah?: number | null, todayStr?: string) {
  return useQuery({
    queryKey: ["muhafiz-dashboard-today-absensi", idHalaqah, todayStr],
    queryFn: async () => {
      if (!idHalaqah || !todayStr) return [];
      try {
        const res = await absensiService.getDailyHalaqah(idHalaqah, todayStr);
        return res.data || [];
      } catch (err) {
        console.error("Gagal memuat absensi hari ini:", err);
        return [];
      }
    },
    enabled: !!idHalaqah && !!todayStr,
  });
}
