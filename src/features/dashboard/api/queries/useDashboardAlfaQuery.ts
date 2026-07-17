import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import type { ViewType } from "../../types";

export function useDashboardAlfaQuery(alfaView: ViewType) {
  return useQuery({
    queryKey: ["dashboard-alfa", alfaView],
    queryFn: async () => {
      const { alfaStudents } = await dashboardService.getAttendanceStats(alfaView);
      return { alfaStudents };
    }
  });
}
