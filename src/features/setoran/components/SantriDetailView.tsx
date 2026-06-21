// src/features/display/pages/SantriDetailView.tsx

import { useEffect, useState, useCallback, useMemo } from "react";
import { displayService } from "@/features/display/api/displayService";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileCard } from "@/features/display/components/santri-detail/ProfileCard";
import { StatistikKehadiran } from "@/features/display/components/santri-detail/StatistikKehadiran";
import { RekapHarian } from "@/features/display/components/santri-detail/RekapHarian";
import { RiwayatSetoran } from "@/features/display/components/santri-detail/RiwayatSetoran";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react"; 
import type { SantriDetailData } from "@/types/domain/display";
import { eachDayOfInterval, startOfMonth, endOfMonth } from "date-fns";
import { sekolahService } from "@/features/sekolah/api/sekolahService";

interface SantriDetailViewProps {
  id: number;
  onBack: () => void;
}

const STATUS_CONFIG = {
  HADIR: { label: "Hadir", color: "#10b981", bg: "bg-green-500" },
  IZIN: { label: "Izin", color: "#3b82f6", bg: "bg-blue-500" },
  SAKIT: { label: "Sakit", color: "#f59e0b", bg: "bg-yellow-500" },
  TERLAMBAT: { label: "Terlambat", color: "#f97316", bg: "bg-orange-500" },
  ALFA: { label: "Alfa", color: "#ef4444", bg: "bg-red-500" },
};

export function SantriDetailView({ id, onBack }: SantriDetailViewProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SantriDetailData | null>(null);
  const [viewDate, setViewDate] = useState<Date>(new Date());

  const daysInMonth = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(viewDate),
      end: endOfMonth(viewDate),
    });
  }, [viewDate]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const profileData = await sekolahService.getProfile();
      const token = profileData.data?.display_token;
      if (!token) throw new Error("Display token tidak ditemukan");
      const res = await displayService.getSantriDetail(token, id);
      setData(res);
    } catch (err) {
      console.error("Error fetching santri detail:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const chartData = useMemo(() => {
    if (!data) return [];
    
    const stats = { HADIR: 0, IZIN: 0, SAKIT: 0, TERLAMBAT: 0, ALFA: 0 };
    data.riwayat_absensi.forEach((item) => {
      const status = item.status as keyof typeof stats;
      if (status in stats) {
        stats[status]++;
      }
    });

    return [
      { name: "Hadir", value: stats.HADIR, fill: STATUS_CONFIG.HADIR.color },
      { name: "Izin", value: stats.IZIN, fill: STATUS_CONFIG.IZIN.color },
      { name: "Sakit", value: stats.SAKIT, fill: STATUS_CONFIG.SAKIT.color },
      { name: "Terlambat", value: stats.TERLAMBAT, fill: STATUS_CONFIG.TERLAMBAT.color },
      { name: "Alfa", value: stats.ALFA, fill: STATUS_CONFIG.ALFA.color },
    ].filter((d) => d.value > 0);
  }, [data]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-48 md:col-span-2 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* HEADER: Dibuat sangat minimalis */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack} 
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">Kembali</span>
        </Button>
        <div className="h-4 w-[1px] bg-border" />
        <h3 className="font-semibold text-base tracking-tight">Detail Progres</h3>
      </div>

      {/* PROFILE: Tanpa pembungkus extra agar tidak double border jika ProfileCard sudah punya border */}
      <ProfileCard
        nama={data.profil.nama_santri}
        halaqah={data.profil.nama_halaqah}
        nomorTelepon={data.profil.nomor_telepon}
        target={data.profil.target}
        muhafiz={data.profil.nama_muhafiz}
      />

      {/* STATS & CALENDAR: Gap diperkecil */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <StatistikKehadiran data={chartData} />
        </div>
        <div className="lg:col-span-2">
          <RekapHarian
            daysInMonth={daysInMonth}
            riwayatAbsensi={data.riwayat_absensi}
            isLoading={false}
            viewDate={viewDate}
            onViewDateChange={setViewDate}
          />
        </div>
      </div>

      {/* TABLE SECTION: Judul dibuat lebih kecil lagi */}
      <div className="space-y-2">
        <div className="px-1">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
            Riwayat Setoran
          </h4>
        </div>
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <RiwayatSetoran data={data.riwayat_setoran} />
        </div>
      </div>
    </div>
  );
}