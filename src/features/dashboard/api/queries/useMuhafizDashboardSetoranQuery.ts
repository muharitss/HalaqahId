import { useQuery } from "@tanstack/react-query";
import { setoranService } from "@/features/setoran/api/services/setoranService";
import { startOfMonth, endOfMonth, format } from "date-fns";

export function useMuhafizDashboardSetoranQuery(userId?: number) {
  return useQuery({
    queryKey: ["muhafiz-dashboard-setoran", userId],
    queryFn: async () => {
      try {
        const now = new Date();
        const start = format(startOfMonth(now), "yyyy-MM-dd");
        const end = format(endOfMonth(now), "yyyy-MM-dd");
        const res = await setoranService.getAllSetoran(undefined, 100, {
          startDate: start,
          endDate: end,
        });
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
    enabled: !!userId,
  });
}
