import { useState, useMemo, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token");

  const [token, setTokenState] = useState<string>(() => {
    if (tokenFromUrl) return tokenFromUrl;
    if (slug) {
      return sessionStorage.getItem(`display_token_${slug}`) || "";
    }
    return "";
  });

  useEffect(() => {
    if (tokenFromUrl) {
      setTokenState(tokenFromUrl);
      if (slug) {
        sessionStorage.setItem(`display_token_${slug}`, tokenFromUrl);
      }
    } else if (slug) {
      const stored = sessionStorage.getItem(`display_token_${slug}`);
      if (stored) {
        setTokenState(stored);
      }
    }
  }, [slug, tokenFromUrl]);

  const updateToken = (newToken: string) => {
    setTokenState(newToken);
    if (slug) {
      sessionStorage.setItem(`display_token_${slug}`, newToken);
    }
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newToken) {
        next.set("token", newToken);
      } else {
        next.delete("token");
      }
      return next;
    });
  };

  const { data, isLoading, isError, error: rawError, refetch } = useSantriDetailQuery(
    slug,
    id,
    token || undefined
  );
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

  const status = (rawError as any)?.response?.status;
  const isAuthError = !token || status === 401 || status === 403;
  const error = isError
    ? isAuthError
      ? "Token Layar Kelas Diperlukan / Tidak Valid"
      : "Gagal memuat data santri. Silakan coba lagi."
    : null;

  return {
    id,
    slug,
    token,
    setToken: updateToken,
    data,
    loading: isLoading,
    error,
    isAuthError,
    viewDate,
    setViewDate,
    daysInMonth,
    chartData,
    refetch,
  };
}
