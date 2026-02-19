"use client"

import * as React from "react";
import { format, startOfWeek, endOfMonth, startOfMonth, eachDayOfInterval } from "date-fns";
import { halaqahService } from "@/services/halaqahService";
import { absensiService } from "@/services/absensiService";
import { useSetoran } from "@/hooks/useSetoran";
import { sanitizeDashboardData } from "@/lib/dataTransformer";

// Components
import { Dashboard } from "@/components/ui/TypedText";
import { ActivityChart } from "./ActivityChart";
import { AttendanceDonutChart } from "./AttendanceDonutChart";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsersViewfinder } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { type AbsensiStat } from "./AttendanceDonutChart";

export default function KepalaMuhafidzDashboard() {
  const { allSetoran, fetchAllSetoran, loading: loadingSetoran } = useSetoran();
  const [chartView, setChartView] = React.useState("pekan");

  // State untuk Absensi
  const [absensiStats, setAbsensiStats] = React.useState<AbsensiStat[]>([]);

  const [absensiView, setAbsensiView] = React.useState("pekan");
  const [totalSantriTerabsen, setTotalSantriTerabsen] = React.useState(0);
  const [loadingAbsensi, setLoadingAbsensi] = React.useState(true);
  const navigate = useNavigate();

  // 1. Fetch Akun & Setoran Awal
  React.useEffect(() => {
    const loadInitialData = async () => {
      try {
        await fetchAllSetoran();
      } catch (err) {
        console.error("Error loading initial data:", err);
      } finally {
        setLoadingAbsensi(false);}
    };
    loadInitialData();
  }, [fetchAllSetoran]);

  // 2. Agregasi Absensi Global (Rentang Waktu + Sanitasi Data)
  const fetchGlobalAttendance = React.useCallback(async () => {
    setLoadingAbsensi(true);
    try {
      const now = new Date();
      const start = absensiView === "pekan" 
        ? startOfWeek(now, { weekStartsOn: 1 }) 
        : startOfMonth(now);
      
      const dates = eachDayOfInterval({ start, end: now }).map(d => format(d, "yyyy-MM-dd"));
      const resHalaqah = await halaqahService.getAllHalaqah();
      const allHalaqah = resHalaqah.data || [];

      // Fetch data paralel per tanggal dan per halaqah
      const promises = dates.flatMap(date => 
        allHalaqah.map(h => 
          absensiService.getRekapHalaqah(h.id_halaqah, date)
            .then(res => res.data || [])
            .catch(() => [])
        )
      );

      const results = await Promise.all(promises);
      const rawData = results.flat();

      // BERSIHKAN DATA: Hanya hitung santri yang belum dihapus
      const cleanData = sanitizeDashboardData(rawData);

      const counts = { HADIR: 0, IZIN: 0, SAKIT: 0, ALFA: 0, TERLAMBAT: 0 };
      cleanData.forEach((item) => {
        const entry = item as { status: string };
        const status = entry.status as keyof typeof counts;
        if (status in counts) {
          counts[status]++;
        }
      });


      setTotalSantriTerabsen(cleanData.length);
      setAbsensiStats([
        { status: "HADIR", count: counts.HADIR, fill: "#22c55e" },      
        { status: "IZIN", count: counts.IZIN, fill: "#3b82f6" },       
        { status: "SAKIT", count: counts.SAKIT, fill: "#eab308" },     
        { status: "TERLAMBAT", count: counts.TERLAMBAT, fill: "#f97316" }, 
        { status: "ALFA", count: counts.ALFA, fill: "#ef4444" },       
      ]);
    } catch (error) {
      console.error("Gagal agregasi absensi:", error);
    } finally {
      setLoadingAbsensi(false);
    }
  }, [absensiView]);

  React.useEffect(() => {
    fetchGlobalAttendance();
  }, [fetchGlobalAttendance]);

  // 3. Logic Filter Grafik Setoran (Juga disanitasi)
  const cleanSetoran = React.useMemo(() => sanitizeDashboardData(allSetoran), [allSetoran]);

  const dataPekanIni = React.useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const counts: Record<string, number> = {};
    days.forEach(d => counts[d] = 0);
    
    cleanSetoran.forEach(s => {
      const d = new Date(s.tanggal_setoran!);
      if (d >= start) {
        const idx = d.getDay() === 0 ? 6 : d.getDay() - 1;
        counts[days[idx]]++;
      }
    });
    return days.map(day => ({ day, setoran: counts[day] }));
  }, [cleanSetoran]);

  const dataBulanIni = React.useMemo(() => {
    const start = startOfMonth(new Date());
    const lastDay = endOfMonth(new Date()).getDate();
    const dayCounts: Record<number, number> = {};
    for (let i = 1; i <= lastDay; i++) dayCounts[i] = 0;
    
    cleanSetoran.forEach(s => {
      const d = new Date(s.tanggal_setoran!);
      if (d >= start) dayCounts[d.getDate()]++;
    });
    return Object.keys(dayCounts).map(date => ({ date: `Tgl ${date}`, setoran: dayCounts[parseInt(date)] }));
  }, [cleanSetoran]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <Dashboard />
        <p className="text-muted-foreground">Analisis data halaqah dan performa muhafidz secara global.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <ActivityChart 
          dataPekan={dataPekanIni} 
          dataBulan={dataBulanIni} 
          view={chartView} 
          onViewChange={setChartView} 
          loading={loadingSetoran} 
        />
        <AttendanceDonutChart 
          data={absensiStats} 
          loading={loadingAbsensi} 
          totalCount={totalSantriTerabsen}
          view={absensiView}
          onViewChange={setAbsensiView}
        />
      </div>
      
      <Button 
        variant="outline" 
        className="w-full h-11 gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
        onClick={() => navigate("/display")}
      >
        <FontAwesomeIcon icon={faUsersViewfinder} className="text-primary" />
        Portal Informasi Santri 
      </Button>
    </div>
  );
}