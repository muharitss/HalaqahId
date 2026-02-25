import { useState, useEffect } from "react";
import { dashboardService } from "../services/dashboardService";
import type { PekanData, BulanData, AbsensiStat, CategoryStat, ViewType } from "../types";
import type { Muhafiz } from "@/services/akunService";

export const useDashboardData = () => {
  const [loading, setLoading] = useState({
    setoran: true,
    absensi: true,
    muhafiz: true
  });
  
  const [setoranData, setSetoranData] = useState<any[]>([]);
  const [muhafizList, setMuhafizList] = useState<Muhafiz[]>([]);
  
  const [chartView, setChartView] = useState<ViewType>("pekan");
  const [absensiView, setAbsensiView] = useState<ViewType>("pekan");
  
  const [weeklyData, setWeeklyData] = useState<PekanData[]>([]);
  const [monthlyData, setMonthlyData] = useState<BulanData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryStat[]>([]);
  
  const [absensiStats, setAbsensiStats] = useState<AbsensiStat[]>([]);
  const [totalAbsensi, setTotalAbsensi] = useState(0);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch setoran
        setLoading(prev => ({ ...prev, setoran: true }));
        const setoran = await dashboardService.getAllSetoran();
        setSetoranData(setoran);
        
        // Process chart data
        setWeeklyData(dashboardService.getWeeklyChartData(setoran));
        setMonthlyData(dashboardService.getMonthlyChartData(setoran));
        setCategoryData(dashboardService.getCategoryDistribution(setoran));
      } catch (error) {
        console.error("Error loading setoran data:", error);
      } finally {
        setLoading(prev => ({ ...prev, setoran: false }));
      }

      // Fetch muhafiz
      try {
        setLoading(prev => ({ ...prev, muhafiz: true }));
        const muhafiz = await dashboardService.getMuhafizList();
        setMuhafizList(muhafiz);
      } catch (error) {
        console.error("Error loading muhafiz data:", error);
      } finally {
        setLoading(prev => ({ ...prev, muhafiz: false }));
      }
    };

    fetchInitialData();
  }, []);

  // Fetch absensi data based on view
  useEffect(() => {
    const fetchAbsensi = async () => {
      setLoading(prev => ({ ...prev, absensi: true }));
      try {
        const { stats, total } = await dashboardService.getAttendanceStats(absensiView);
        setAbsensiStats(stats);
        setTotalAbsensi(total);
      } catch (error) {
        console.error("Error loading absensi data:", error);
      } finally {
        setLoading(prev => ({ ...prev, absensi: false }));
      }
    };

    fetchAbsensi();
  }, [absensiView]);

  // Update chart data when setoran data changes
  useEffect(() => {
    if (setoranData.length > 0) {
      setWeeklyData(dashboardService.getWeeklyChartData(setoranData));
      setMonthlyData(dashboardService.getMonthlyChartData(setoranData));
      setCategoryData(dashboardService.getCategoryDistribution(setoranData));
    }
  }, [setoranData]);

  return {
    loading,
    chartView,
    setChartView,
    absensiView,
    setAbsensiView,
    weeklyData,
    monthlyData,
    categoryData,
    absensiStats,
    totalAbsensi,
    muhafizList
  };
};