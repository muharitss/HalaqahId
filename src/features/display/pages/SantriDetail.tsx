import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { displayService } from "@/features/display/services/displayService";
import { startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { SantriDetailHeader } from "@/features/display/components/santri-detail/SantriDetailHeader";
import { ProfileCard } from "@/features/display/components/santri-detail/ProfileCard";
import { StatistikKehadiran } from "@/features/display/components/santri-detail/StatistikKehadiran";
import { RekapHarian } from "@/features/display/components/santri-detail/RekapHarian";
import { RiwayatSetoran } from "@/features/display/components/santri-detail/RiwayatSetoran";
import type { SantriDetailData } from "@/types/domain/display";

const STATUS_CONFIG = {
  HADIR: { label: "Hadir", color: "#10b981", bg: "bg-emerald-500" },
  IZIN: { label: "Izin", color: "#3b82f6", bg: "bg-blue-500" },
  SAKIT: { label: "Sakit", color: "#f59e0b", bg: "bg-amber-500" },
  TERLAMBAT: { label: "Terlambat", color: "#f97316", bg: "bg-orange-500" },
  ALFA: { label: "Alfa", color: "#ef4444", bg: "bg-red-500" },
};

const SantriDetail = () => {
  const { id, token } = useParams<{ id: string; token: string }>();
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
    if (!id || !token) return;
    try {
      setLoading(true);
      const res = await displayService.getSantriDetail(token, id);
      setData(res);
    } catch (err) {
      console.error("Error fetching santri detail:", err);
    } finally {
      setLoading(false);
    }
  }, [id, token]);

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
      <div className="flex h-screen items-center justify-center">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-20 text-center text-muted-foreground">
        Data santri dengan ID {id} tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 transition-colors duration-300">
      <div className="mx-auto max-w-5xl space-y-6">
        <SantriDetailHeader />

        <ProfileCard
          nama={data.profil.nama_santri}
          halaqah={data.profil.nama_halaqah}
          nomorTelepon={data.profil.nomor_telepon}
          target={data.profil.target}
          muhafiz={data.profil.nama_muhafiz}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <StatistikKehadiran data={chartData} />
          <RekapHarian
            daysInMonth={daysInMonth}
            riwayatAbsensi={data.riwayat_absensi}
            isLoading={false}
            viewDate={viewDate}
            onViewDateChange={setViewDate}
          />
        </div>

        <RiwayatSetoran data={data.riwayat_setoran} />
      </div>
    </div>
  );
};

export default SantriDetail;
