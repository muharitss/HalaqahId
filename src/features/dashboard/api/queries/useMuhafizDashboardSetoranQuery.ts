import { useQuery } from "@tanstack/react-query";
import { setoranService } from "@/features/setoran/api/services/setoranService";

export function useMuhafizDashboardSetoranQuery(userId?: number) {
  return useQuery({
    queryKey: ["muhafiz-dashboard-setoran", userId],
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
    enabled: !!userId,
  });
}
