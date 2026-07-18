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

  const { data: initialData, isFetching: loadingInitial } = useDashboardInitialQuery();
  const { data: absensiData, isFetching: loadingAbsensi } = useDashboardAbsensiQuery(absensiView);
  const { data: alfaData, isFetching: loadingAlfa } = useDashboardAlfaQuery(alfaView);
  const { data: juzDistributionData, isFetching: loadingJuz } = useDashboardJuzDistributionQuery();

  const setoranData = useMemo(() => initialData?.setoran || [], [initialData?.setoran]);
  
  const weeklyData = useMemo(() => dashboardService.getWeeklyChartData(setoranData), [setoranData]);
  const monthlyData = useMemo(() => dashboardService.getMonthlyChartData(setoranData), [setoranData]);
  const categoryData = useMemo(() => dashboardService.getCategoryDistribution(setoranData), [setoranData]);

  const stats = useMemo(() => {
    const grouped = laporanService.transformSetoranData(setoranData as any);
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


