import { useQuery } from "@tanstack/react-query";
import { santriService } from "@/features/santri";

export function useMuhafizDashboardSantriQuery(userId?: number) {
  return useQuery({
    queryKey: ["muhafiz-dashboard-santri", userId],
    queryFn: async () => {
      const res = await santriService.getAll();
      return res || [];
    },
    enabled: !!userId,
  });
}
