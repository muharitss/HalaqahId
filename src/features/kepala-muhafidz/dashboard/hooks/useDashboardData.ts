import { useState, useEffect } from "react";
import { dashboardService } from "../services/dashboardService";
import type { PekanData, BulanData, AbsensiStat, CategoryStat, ViewType, SetoranData } from "../types";
import type { Muhafiz } from "@/services/akunService";

export const useDashboardData = () => {
  const [loading, setLoading] = useState({
    setoran: true,
    absensi: true,
    muhafiz: true
  });
  
  const [setoranData, setSetoranData] = useState<SetoranData[]>([]);
  const [muhafizList, setMuhafizList] = useState<Muhafiz[]>([]);
  
  const [chartView, setChartView] = useState<ViewType>("pekan");
  const [absensiView, setAbsensiView] = useState<ViewType>("pekan");
  
  const [weeklyData, setWeeklyData] = useState<PekanData[]>([]);
  const [monthlyData, setMonthlyData] = useState<BulanData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryStat[]>([]);
  
  const [absensiStats, setAbsensiStats] = useState<AbsensiStat[]>([]);
  const [totalAbsensi, setTotalAbsensi] = useState(0);

  // Fetch initial data
// Di useDashboardData.ts
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(prev => ({ ...prev, setoran: true, muhafiz: true }));
        
        // Panggil paralel agar lebih cepat
        const [setoran, muhafiz] = await Promise.all([
          dashboardService.getAllSetoran(),
          dashboardService.getMuhafizList()
        ]);

        setSetoranData(setoran);
        setMuhafizList(muhafiz);

        // Langsung proses data di sini
        if (setoran.length > 0) {
          setWeeklyData(dashboardService.getWeeklyChartData(setoran));
          setMonthlyData(dashboardService.getMonthlyChartData(setoran));
          setCategoryData(dashboardService.getCategoryDistribution(setoran));
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(prev => ({ ...prev, setoran: false, muhafiz: false }));
      }
    };

    fetchInitialData();
  }, []); // Cukup sekali saat mount

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