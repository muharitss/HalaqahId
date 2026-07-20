import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLeaderboard } from "../api/queries/useLeaderboard";
import { halaqahService } from "@/features/halaqah";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { LeaderboardRecord } from "../api/services/setoranService";
import type { Halaqah } from "@/features/halaqah/types";

export interface UseLeaderboardPageParams {
  role: "admin" | "muhafiz";
}

export interface UseLeaderboardPageResult {
  period: string;
  startDate: string;
  endDate: string;
  selectedHalaqah: string;
  topPerHalaqah: boolean;
  searchQuery: string;
  halaqahList: Halaqah[];
  leaderboardData: LeaderboardRecord[];
  filteredLeaderboard: LeaderboardRecord[];
  isLoading: boolean;
  topThree: {
    gold: LeaderboardRecord | null;
    silver: LeaderboardRecord | null;
    bronze: LeaderboardRecord | null;
  };
  listRemaining: LeaderboardRecord[];
  setPeriod: (p: string) => void;
  setStartDate: (d: string) => void;
  setEndDate: (d: string) => void;
  setSelectedHalaqah: (h: string) => void;
  setTopPerHalaqah: (t: boolean) => void;
  setSearchQuery: (q: string) => void;
  getPeriodeLabel: () => string;
  handlePrint: () => void;
}

export function useLeaderboardPage({ role }: UseLeaderboardPageParams): UseLeaderboardPageResult {
  const [period, setPeriod] = useState<string>("pekan_ini");
  const [startDate, setStartDate] = useState<string>(
    format(new Date(), "yyyy-MM-01") // awal bulan default
  );
  const [endDate, setEndDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd") // hari ini default
  );
  const [selectedHalaqah, setSelectedHalaqah] = useState<string>("all");
  const [topPerHalaqah, setTopPerHalaqah] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 1. Fetch Daftar Halaqah untuk Filter Admin
  const { data: halaqahList = [] } = useQuery<Halaqah[]>({
    queryKey: ["leaderboard-halaqah-list"],
    queryFn: async () => {
      const res = await halaqahService.getAllHalaqah();
      return res || [];
    },
    enabled: role === "admin",
  });

  // 2. Query data leaderboard dari server
  const leaderboardParams = useMemo(() => {
    return {
      period,
      startDate: period === "kustom" ? startDate : undefined,
      endDate: period === "kustom" ? endDate : undefined,
      id_halaqah: role === "admin" && selectedHalaqah !== "all" ? Number(selectedHalaqah) : undefined,
      mode: role === "admin" && topPerHalaqah ? "top_per_halaqah" : "global",
    };
  }, [role, period, startDate, endDate, selectedHalaqah, topPerHalaqah]);

  const { data: leaderboardData = [], isLoading } = useLeaderboard(leaderboardParams);

  // 3. Client-side Search / Filtering berdasarkan nama santri
  const filteredLeaderboard = useMemo(() => {
    if (!searchQuery.trim()) return leaderboardData;
    const query = searchQuery.toLowerCase();
    return leaderboardData.filter((item) =>
      item.nama_santri.toLowerCase().includes(query)
    );
  }, [leaderboardData, searchQuery]);

  // 4. Pisahkan top 3 untuk tampilan podium
  const topThree = useMemo(() => {
    const gold = filteredLeaderboard.find((x) => x.rank === 1) || null;
    const silver = filteredLeaderboard.find((x) => x.rank === 2) || null;
    const bronze = filteredLeaderboard.find((x) => x.rank === 3) || null;
    return { gold, silver, bronze };
  }, [filteredLeaderboard]);

  const listRemaining = useMemo(() => {
    return filteredLeaderboard.filter((x) => x.rank > 3);
  }, [filteredLeaderboard]);

  // 5. Cetak halaman
  const handlePrint = () => {
    window.print();
  };

  const getPeriodeLabel = () => {
    if (period === "pekan_ini") return "Pekan Ini";
    if (period === "bulan_ini") return "Bulan Ini";
    if (period === "semua") return "Semua Waktu";
    if (period === "kustom") {
      try {
        const from = format(new Date(startDate), "d MMMM yyyy", { locale: id });
        const to = format(new Date(endDate), "d MMMM yyyy", { locale: id });
        return `${from} - ${to}`;
      } catch {
        return "Periode Kustom";
      }
    }
    return "Leaderboard";
  };

  return {
    period,
    startDate,
    endDate,
    selectedHalaqah,
    topPerHalaqah,
    searchQuery,
    halaqahList,
    leaderboardData,
    filteredLeaderboard,
    isLoading,
    topThree,
    listRemaining,
    setPeriod,
    setStartDate,
    setEndDate,
    setSelectedHalaqah,
    setTopPerHalaqah,
    setSearchQuery,
    getPeriodeLabel,
    handlePrint,
  };
}
