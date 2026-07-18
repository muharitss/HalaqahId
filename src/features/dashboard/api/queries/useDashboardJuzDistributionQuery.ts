import { useQuery } from "@tanstack/react-query";
import { sekolahService } from "@/features/sekolah";

export function useDashboardJuzDistributionQuery() {
  return useQuery({
    queryKey: ["dashboard-juz-distribution"],
    queryFn: async () => {
      const res = await sekolahService.getJuzDistribution();
      return res.data;
    }
  });
}
