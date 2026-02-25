import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { displayService } from "@/features/display/services/displayService";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns"; import { Skeleton } from "@/components/ui/skeleton";
import { SantriDetailHeader } from "@/features/display/components/santri-detail/SantriDetailHeader";
import { ProfileCard } from "@/features/display/components/santri-detail/ProfileCard";
import { StatistikKehadiran } from "@/features/display/components/santri-detail/StatistikKehadiran";
import { RekapHarian } from "@/features/display/components/santri-detail/RekapHarian";
import { RiwayatSetoran } from "@/features/display/components/santri-detail/RiwayatSetoran";


export interface Santri {
  id_santri: number | string;
  nama_santri: string;
  nama_halaqah: string;
  nomor_telepon?: string;
}

export interface Halaqah {
  id_halaqah: number;
  nama_halaqah: string;
  nama_muhafiz: string;
  jumlah_santri: number;
}

export interface SetoranRecord {
  id_setoran: number;
  nama_santri: string;
  nama_halaqah: string;
  tanggal: string;         
  surat: string;
  juz: number;
  ayat: string;            
  kategori: "HAFALAN" | "MUROJAAH" | string;
}

const STATUS_CONFIG = {
  HADIR: { label: "Hadir", color: "#10b981", bg: "bg-emerald-500" },
  IZIN: { label: "Izin", color: "#3b82f6", bg: "bg-blue-500" },
  SAKIT: { label: "Sakit", color: "#f59e0b", bg: "bg-amber-500" },
  TERLAMBAT: { label: "Terlambat", color: "#f97316", bg: "bg-orange-500" },
  ALFA: { label: "Alfa", color: "#ef4444", bg: "bg-red-500" },
};

const SantriDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [santri, setSantri] = useState<Santri | null>(null);
  const [allSetoran, setAllSetoran] = useState<SetoranRecord[]>([]);
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [monthlyAbsensi, setMonthlyAbsensi] = useState<any[]>([]);
  const [isLoadingAbsensi, setIsLoadingAbsensi] = useState(false);

  const daysInMonth = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(viewDate),
      end: endOfMonth(viewDate),
    });
  }, [viewDate]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [resSantri, resSetoran] = await Promise.all([
        displayService.getSantriList(),
        displayService.getSetoranAll(),
      ]);

      const currentSantri = resSantri.find((s: Santri) => String(s.id_santri) === String(id));

      if (!currentSantri) {
        setSantri(null);
        return;
      }

      setSantri(currentSantri);
      const filteredSetoran = resSetoran.filter(
        (set: SetoranRecord) => set.nama_santri === currentSantri.nama_santri
      );
      setAllSetoran(filteredSetoran);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchMonthlyAbsensi = useCallback(async () => {
    if (!santri) return;

    setIsLoadingAbsensi(true);
    try {
      const halaqahList = await displayService.getHalaqahList();
      const currentHalaqah = (halaqahList as any[]).find(
        (h) => h.nama_halaqah === santri.nama_halaqah
      );

      if (!currentHalaqah) return;

      const requests = daysInMonth.map((date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        return displayService
          .getAbsensiByHalaqah(currentHalaqah.id_halaqah, dateStr)
          .then((res) => ({ tanggal: dateStr, data: res }))
          .catch(() => ({ tanggal: dateStr, data: [] }));
      });

      const results = await Promise.all(requests);
      setMonthlyAbsensi(results);
    } catch (err) {
      console.error("Error fetching absensi:", err);
    } finally {
      setIsLoadingAbsensi(false);
    }
  }, [santri, daysInMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchMonthlyAbsensi();
  }, [fetchMonthlyAbsensi]);

  const chartData = useMemo(() => {
    const stats = { HADIR: 0, IZIN: 0, SAKIT: 0, TERLAMBAT: 0, ALFA: 0 };
    monthlyAbsensi.forEach((day) => {
      const record = day.data?.find((item: any) => item.nama_santri === santri?.nama_santri);
      if (record?.status && stats.hasOwnProperty(record.status)) {
        stats[record.status as keyof typeof stats]++;
      }
    });

    return [
      { name: "Hadir", value: stats.HADIR, fill: STATUS_CONFIG.HADIR.color },
      { name: "Izin", value: stats.IZIN, fill: STATUS_CONFIG.IZIN.color },
      { name: "Sakit", value: stats.SAKIT, fill: STATUS_CONFIG.SAKIT.color },
      { name: "Terlambat", value: stats.TERLAMBAT, fill: STATUS_CONFIG.TERLAMBAT.color },
      { name: "Alfa", value: stats.ALFA, fill: STATUS_CONFIG.ALFA.color },
    ].filter((d) => d.value > 0);
  }, [monthlyAbsensi, santri]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  if (!santri) {
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
          nama={santri.nama_santri}
          halaqah={santri.nama_halaqah}
          nomorTelepon={santri.nomor_telepon}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <StatistikKehadiran data={chartData} />
          <RekapHarian
            daysInMonth={daysInMonth}
            monthlyAbsensi={monthlyAbsensi}
            santriName={santri.nama_santri}
            isLoading={isLoadingAbsensi}
            viewDate={viewDate}
            onViewDateChange={setViewDate}
          />
        </div>

        <RiwayatSetoran data={allSetoran} />
      </div>
    </div>
  );
};

export default SantriDetail;