import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { useSantriDetail as useSantriDetailQuery } from "../api";

const STATUS_CONFIG = {
  HADIR: { color: "#10b981" },
  IZIN: { color: "#3b82f6" },
  SAKIT: { color: "#f59e0b" },
  TERLAMBAT: { color: "#f97316" },
  ALFA: { color: "#ef4444" },
};

export function useSantriDetail() {
  const { id, slug } = useParams<{ id: string; slug: string }>();
  const { data, isLoading, isError, refetch } = useSantriDetailQuery(slug, id);
  const [viewDate, setViewDate] = useState<Date>(new Date());

  const daysInMonth = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(viewDate),
      end: endOfMonth(viewDate),
    });
  }, [viewDate]);

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

  const error = isError ? "Gagal memuat data santri. Silakan coba lagi." : null;

  return {
    id,
    data,
    loading: isLoading,
    error,
    viewDate,
    setViewDate,
    daysInMonth,
    chartData,
    refetch,
  };
}
