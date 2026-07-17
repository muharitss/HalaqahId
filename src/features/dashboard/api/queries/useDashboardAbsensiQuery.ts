import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import type { ViewType } from "../../types";

export function useDashboardAbsensiQuery(absensiView: ViewType) {
  return useQuery({
    queryKey: ["dashboard-absensi", absensiView],
    queryFn: async () => {
      const { stats, total } = await dashboardService.getAttendanceStats(absensiView);
      return { stats, total };
    }
  });
}
