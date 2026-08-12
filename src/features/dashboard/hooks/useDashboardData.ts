import { useState, useMemo } from "react";
import {
  dashboardService,
  useDashboardInitialQuery,
  useDashboardAbsensiQuery,
  useDashboardAlfaQuery,
  useDashboardJuzDistributionQuery,
} from "../api";
import { laporanService } from "@/features/setoran/api/laporanService";
import type { ViewType } from "../types";

export const useDashboardData = () => {
  const [chartView, setChartView] = useState<ViewType>("pekan");
  const [absensiView, setAbsensiView] = useState<ViewType>("pekan");
  const [alfaView, setAlfaView] = useState<ViewType>("pekan");

  const { data: initialData, isLoading: loadingInitial } = useDashboardInitialQuery();
  const { data: absensiData, isLoading: loadingAbsensi } = useDashboardAbsensiQuery(absensiView);
  const { data: alfaData, isLoading: loadingAlfa } = useDashboardAlfaQuery(alfaView);
  const { data: juzDistributionData, isLoading: loadingJuz } = useDashboardJuzDistributionQuery();

  const setoranData = useMemo(() => initialData?.setoran || [], [initialData?.setoran]);
  
  const weeklyData = useMemo(() => dashboardService.getWeeklyChartData(setoranData), [setoranData]);
  const monthlyData = useMemo(() => dashboardService.getMonthlyChartData(setoranData), [setoranData]);
  const categoryData = useMemo(() => dashboardService.getCategoryDistribution(setoranData), [setoranData]);

  const stats = useMemo(() => {
    const grouped = laporanService.transformSetoranData(setoranData as unknown as Parameters<typeof laporanService.transformSetoranData>[0]);
    return laporanService.getSummaryStats(grouped, "all", "Semua Periode");
  }, [setoranData]);

  return {
    loading: {
      setoran: loadingInitial,
      absensi: loadingAbsensi,
      muhafiz: loadingInitial,
      alfa: loadingAlfa,
      juz: loadingJuz
    },
    chartView,
    setChartView,
    absensiView,
    setAbsensiView,
    alfaView,
    setAlfaView,
    weeklyData,
    monthlyData,
    categoryData,
    absensiStats: absensiData?.stats || [],
    totalAbsensi: absensiData?.total || 0,
    alfaStudents: alfaData?.alfaStudents || [],
    muhafizList: initialData?.muhafiz || [],
    stats,
    juzDistribution: juzDistributionData || { distribution: [], belum_setoran: 0, total_santri: 0 }
  };
};


