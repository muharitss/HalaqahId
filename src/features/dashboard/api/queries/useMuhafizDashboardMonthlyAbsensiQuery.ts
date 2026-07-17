import { useQuery } from "@tanstack/react-query";
import { absensiService } from "@/features/absensi";

export function useMuhafizDashboardMonthlyAbsensiQuery(idHalaqah?: number | null, currentMonth?: string, currentYear?: string) {
  return useQuery({
    queryKey: [
      "muhafiz-dashboard-monthly-absensi",
      idHalaqah,
      currentMonth,
      currentYear,
    ],
    queryFn: async () => {
      if (!idHalaqah || !currentMonth || !currentYear) return [];
      try {
        const res = await absensiService.getRekapHalaqah(
          idHalaqah,
          undefined,
          currentMonth,
          currentYear,
        );
        return (res.data as any[]) || [];
      } catch (err) {
        console.error("Gagal memuat rekap bulanan absensi:", err);
        return [];
      }
    },
    enabled: !!idHalaqah && !!currentMonth && !!currentYear,
  });
}
