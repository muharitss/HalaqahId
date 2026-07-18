import { useEffect, useState } from "react";
import { setoranService } from "@/features/setoran/api/services/setoranService";
import { type LaporanHafalanData } from "@/features/setoran/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface LaporanKonsolidasiProps {
  santriId: number;
}

export function LaporanKonsolidasi({ santriId }: LaporanKonsolidasiProps) {
  const [data, setData] = useState<LaporanHafalanData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLaporan() {
      try {
        setLoading(true);
        const res = await setoranService.getLaporanHafalan(santriId);
        setData(res.data as unknown as LaporanHafalanData);
      } catch (error) {
        console.error("Gagal mengambil laporan konsolidasi", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLaporan();
  }, [santriId]);

  if (loading) {
    return <Skeleton className="h-48 w-full rounded-lg" />;
  }

  if (!data || !data.laporan || data.laporan.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-6 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">
          Belum ada data laporan konsolidasi hafalan.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
      <div className="border-b px-4 py-3 bg-muted/20">
        <h4 className="text-sm font-semibold">Laporan Konsolidasi Hafalan</h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          Total rentang hafalan murni (tanpa duplikasi) berdasarkan kategori.
        </p>
      </div>
      <div className="p-4 space-y-4">
        {data.laporan.map((kat, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className="font-semibold bg-primary/5 text-primary"
              >
                {kat.kategori}
              </Badge>
              <span className="text-xs font-medium bg-muted px-2 py-1 rounded-md">
                Total: {kat.total_ayat} Ayat
              </span>
            </div>

            {kat.ranges && kat.ranges.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {kat.ranges.map((range, rIdx) => (
                  <li
                    key={rIdx}
                    className="text-xs border rounded-md p-2 flex justify-between bg-background"
                  >
                    <span className="font-medium text-foreground">
                      {range.start_surah} {range.start_ayat} - {range.end_surah}{" "}
                      {range.end_ayat}
                    </span>
                    <span className="text-muted-foreground">
                      {range.total_ayat} ayat
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground italic pl-1">
                Tidak ada rentang ayat tercatat.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
