"use client"

import { useDashboardData } from "./hooks/useDashboardData";
import { Dashboard } from "@/components/typed-text";
import { ActivityChart } from "./components/ActivityChart";
import { AttendanceDonutChart } from "./components/AttendanceDonutChart";
import { CategoryPieChart } from "./components/CategoryPieChart";
import { MuhafizTable } from "./components/MuhafizTable";
import { PublicPortalButton } from "./components/PublicPortalButton";

export default function KepalaMuhafidzDashboard() {
  const {
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
  } = useDashboardData();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <Dashboard />
        <p className="text-muted-foreground">Analisis data halaqah dan performa muhafidz secara global.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <ActivityChart 
          dataPekan={weeklyData} 
          dataBulan={monthlyData} 
          view={chartView} 
          onViewChange={setChartView} 
          loading={loading.setoran} 
        />
        <AttendanceDonutChart 
          data={absensiStats} 
          loading={loading.absensi} 
          totalCount={totalAbsensi}
          view={absensiView}
          onViewChange={setAbsensiView}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <CategoryPieChart data={categoryData} loading={loading.setoran} />
        <div className="lg:col-span-3">
          <PublicPortalButton />
        </div>
      </div>
      
      <MuhafizTable data={muhafizList} loading={loading.muhafiz} />
    </div>
  );
}