"use client"

import { useDashboardData } from "./hooks/useDashboardData";
import { Dashboard } from "@/components/typed-text";
import { ActivityChart } from "./components/ActivityChart";
import { AttendanceDonutChart } from "./components/AttendanceDonutChart";

export default function KepalaMuhafidzDashboard() {
  const {
    loading,
    chartView,
    setChartView,
    absensiView,
    setAbsensiView,
    weeklyData,
    monthlyData,
    absensiStats,
    totalAbsensi,
  } = useDashboardData();

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
        <div className="space-y-1">
          <Dashboard />
        </div>
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

      {/* <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <PublicPortalButton />
        </div>
      </div> */}
      
    </div>
  );
}