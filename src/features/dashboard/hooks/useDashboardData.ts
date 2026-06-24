import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../api/dashboardService";
import type { ViewType } from "../types";

export const useDashboardData = () => {
  const [chartView, setChartView] = useState<ViewType>("pekan");
  const [absensiView, setAbsensiView] = useState<ViewType>("pekan");

  const { data: initialData, isFetching: loadingInitial } = useQuery({
    queryKey: ["dashboard-initial"],
    queryFn: async () => {
      try {
        const [setoran, muhafiz] = await Promise.all([
          dashboardService.getAllSetoran(),
          dashboardService.getMuhafizList()
        ]);
        return { setoran, muhafiz };
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        throw error;
      }
    }
  });

  const { data: absensiData, isFetching: loadingAbsensi } = useQuery({
    queryKey: ["dashboard-absensi", absensiView],
    queryFn: async () => {
      try {
        const { stats, total } = await dashboardService.getAttendanceStats(absensiView);
        return { stats, total };
      } catch (error) {
        console.error("Error loading absensi data:", error);
        throw error;
      }
    }
  });

  const setoranData = initialData?.setoran || [];
  
  const weeklyData = useMemo(() => dashboardService.getWeeklyChartData(setoranData), [setoranData]);
  const monthlyData = useMemo(() => dashboardService.getMonthlyChartData(setoranData), [setoranData]);
  const categoryData = useMemo(() => dashboardService.getCategoryDistribution(setoranData), [setoranData]);

  return {
    loading: {
      setoran: loadingInitial,
      absensi: loadingAbsensi,
      muhafiz: loadingInitial
    },
    chartView,
    setChartView,
    absensiView,
    setAbsensiView,
    weeklyData,
    monthlyData,
    categoryData,
    absensiStats: absensiData?.stats || [],
    totalAbsensi: absensiData?.total || 0,
    muhafizList: initialData?.muhafiz || []
  };
};
