import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { displayService } from "@/features/display/api/displayService";
import { startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { SantriDetailHeader } from "@/features/display/components/santri-detail/SantriDetailHeader";
import { ProfileCard } from "@/features/display/components/santri-detail/ProfileCard";
import { StatistikKehadiran } from "@/features/display/components/santri-detail/StatistikKehadiran";
import { RekapHarian } from "@/features/display/components/santri-detail/RekapHarian";
import { RiwayatSetoran } from "@/features/display/components/santri-detail/RiwayatSetoran";
import type { SantriDetailData } from "@/types/domain/display";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STATUS_CONFIG = {
  HADIR: { label: "Hadir", color: "#10b981" },
  IZIN: { label: "Izin", color: "#3b82f6" },
  SAKIT: { label: "Sakit", color: "#f59e0b" },
  TERLAMBAT: { label: "Terlambat", color: "#f97316" },
  ALFA: { label: "Alfa", color: "#ef4444" },
};

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 px-4 md:px-8 py-3 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
      </div>

      <main className="px-4 md:px-8 py-6 md:py-10">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Profile skeleton */}
          <Card className="border border-border/60 bg-card overflow-hidden shadow-sm">
            <div className="h-24 bg-muted/30" />
            <CardContent className="px-5 pb-5 -mt-10">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-5">
                <Skeleton className="h-20 w-20 rounded-xl" />
                <div className="flex-1 space-y-2 pb-0.5">
                  <Skeleton className="h-6 w-48" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-24 rounded-md" />
                    <Skeleton className="h-5 w-20 rounded-md" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
              </div>
            </CardContent>
          </Card>

          {/* Charts skeleton */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="border border-border/60 bg-card shadow-sm p-6">
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </Card>
            <Card className="border border-border/60 bg-card shadow-sm p-6 lg:col-span-2">
              <div className="flex justify-between mb-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-32 rounded-md" />
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: 35 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 rounded-lg" />
                ))}
              </div>
            </Card>
          </div>

          {/* Table skeleton */}
          <Card className="border border-border/60 bg-card shadow-sm p-6">
            <Skeleton className="h-4 w-40 mb-4" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full mb-2 rounded-md" />
            ))}
          </Card>
        </div>
      </main>
    </div>
  );
}

const SantriDetail = () => {
  const { id, token } = useParams<{ id: string; token: string }>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SantriDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);
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
      setError(null);
      const res = await displayService.getSantriDetail(token, id);
      setData(res);
    } catch (err) {
      console.error("Error fetching santri detail:", err);
      setError("Gagal memuat data santri. Silakan coba lagi.");
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
    return <DetailSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <Card className="max-w-sm w-full border border-border/60 shadow-sm">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-7 w-7 text-destructive" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Terjadi Kesalahan</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button onClick={fetchData} variant="outline" size="sm">
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <Card className="max-w-sm w-full border border-border/60 shadow-sm">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-muted/60 flex items-center justify-center">
              <AlertCircle className="h-7 w-7 text-muted-foreground/50" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Data Tidak Ditemukan</h3>
              <p className="text-sm text-muted-foreground">Santri dengan ID {id} tidak ditemukan.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <SantriDetailHeader santriName={data.profil.nama_santri} />

      <main className="px-4 md:px-8 py-6 md:py-10">
        <div className="mx-auto max-w-5xl space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
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
      </main>
    </div>
  );
};

export default SantriDetail;
