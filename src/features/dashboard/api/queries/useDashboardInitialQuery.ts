import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";

export function useDashboardInitialQuery() {
  return useQuery({
    queryKey: ["dashboard-initial"],
    queryFn: async () => {
      const [setoran, muhafiz] = await Promise.all([
        dashboardService.getAllSetoran(),
        dashboardService.getMuhafizList()
      ]);
      return { setoran, muhafiz };
    }
  });
}
