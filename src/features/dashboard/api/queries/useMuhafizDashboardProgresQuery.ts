import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { progresService } from "@/features/santri";
import { type ProgresSantri } from "@/features/santri/types";

export function useMuhafizDashboardProgresQuery(userId?: number): UseQueryResult<ProgresSantri[], Error> {
  return useQuery<ProgresSantri[], Error>({
    queryKey: ["muhafiz-dashboard-progres", userId],
    queryFn: async () => {
      const res = await progresService.getAllProgres();
      return res.data || [];
    },
    enabled: !!userId,
  });
}
