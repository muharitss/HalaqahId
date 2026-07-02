import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { laporanService } from "../api/laporanService";
import { startOfDay, endOfDay, isWithinInterval } from "date-fns";
import type { GroupedData, GroupedHalaqahItem, GroupedSantriItem, SetoranItem } from "../types";

export interface LaporanFilters {
  // Period filters (bulan/tahun — legacy, tetap dipertahankan)
  selectedMonth: number | null;
  selectedYear: number | null;
  // Halaqah filter
  activeHalaqah: string;
  // Santri filter (nama)
  selectedSantri: string; // "" = semua
  // Date range filter (lebih spesifik dari bulan/tahun)
  dateFrom: Date | null;
  dateTo: Date | null;
  // Kategori filter
  selectedKategori: string; // "" = semua
}

export const useLaporanData = () => {
  const [filters, setFilters] = useState<LaporanFilters>({
    selectedMonth: new Date().getMonth(),
    selectedYear: new Date().getFullYear(),
    activeHalaqah: "",
    selectedSantri: "",
    dateFrom: null,
    dateTo: null,
    selectedKategori: "",
  });

  const {
    data: { allSetoran = [], listHalaqah = [], masterSantri = [] } = {},
    isFetching: loading,
    refetch: fetchData,
  } = useQuery({
    queryKey: ["laporan-data"],
    queryFn: async () => {
      try {
        const [setoranData, halaqahData, santriData] = await Promise.all([
          laporanService.getAllSetoran(),
          laporanService.getAllHalaqah(),
          laporanService.getAllSantri(),
        ]);
        return {
          allSetoran: setoranData,
          listHalaqah: halaqahData,
          masterSantri: santriData,
        };
      } catch (error) {
        console.error("Gagal mengambil data laporan:", error);
        throw error;
      }
    },
  });

  // ─── Grouped data (bulan/tahun filter untuk transformSetoranData) ──────────
  const groupedDataRaw = useMemo(() => {
    // Jika ada date range aktif, skip filter bulan/tahun
    const dateFilter =
      filters.dateFrom || filters.dateTo
        ? { month: null, year: null }
        : { month: filters.selectedMonth, year: filters.selectedYear };

    return laporanService.transformSetoranData(allSetoran, dateFilter);
  }, [allSetoran, filters.selectedMonth, filters.selectedYear, filters.dateFrom, filters.dateTo]);

  // ─── Derived data ──────────────────────────────────────────────────────────
  const halaqahNames = useMemo(
    () => laporanService.getHalaqahNames(groupedDataRaw),
    [groupedDataRaw]
  );

  // Computed effective active halaqah to prevent syncing via useEffect
  const effectiveActiveHalaqah = useMemo(() => {
    if (filters.activeHalaqah === "all") return "all";
    if (halaqahNames.length > 0 && !halaqahNames.includes(filters.activeHalaqah)) {
      return halaqahNames[0];
    }
    return filters.activeHalaqah;
  }, [filters.activeHalaqah, halaqahNames]);

  // ─── Apply additional client-side filters ──────────────────────────────────
  const groupedData = useMemo(() => {
    const result: GroupedData = {};

    Object.entries(groupedDataRaw).forEach(([halaqahName, group]: [string, GroupedHalaqahItem]) => {
      // Filter halaqah
      if (
        effectiveActiveHalaqah !== "all" &&
        effectiveActiveHalaqah !== "" &&
        halaqahName !== effectiveActiveHalaqah
      ) {
        return;
      }

      const filteredSantriGroup: Record<number, GroupedSantriItem> = {};

      Object.entries(group.santriGroup).forEach(([santriKey, santri]: [string, GroupedSantriItem]) => {
        // Filter santri by name
        if (
          filters.selectedSantri !== "" &&
          !santri.nama.toLowerCase().includes(filters.selectedSantri.toLowerCase())
        ) {
          return;
        }

        // Filter individual setoran by date range & kategori
        const filteredSetoran = santri.setoran.filter((s: SetoranItem) => {
          const tgl = new Date(s.tanggal_setoran);

          // Date range filter
          if (filters.dateFrom && filters.dateTo) {
            if (
              !isWithinInterval(tgl, {
                start: startOfDay(filters.dateFrom),
                end: endOfDay(filters.dateTo),
              })
            ) {
              return false;
            }
          } else if (filters.dateFrom) {
            if (tgl < startOfDay(filters.dateFrom)) return false;
          } else if (filters.dateTo) {
            if (tgl > endOfDay(filters.dateTo)) return false;
          }

          // Kategori filter
          if (filters.selectedKategori !== "" && s.kategori !== filters.selectedKategori) {
            return false;
          }

          return true;
        });

        if (filteredSetoran.length > 0) {
          filteredSantriGroup[Number(santriKey)] = {
            ...santri,
            setoran: filteredSetoran,
            // Recalculate stats
            stats: filteredSetoran.reduce(
              (acc: Record<string, number>, s: SetoranItem) => {
                acc[s.kategori] = (acc[s.kategori] ?? 0) + 1;
                return acc;
              },
              { HAFALAN: 0, MURAJAAH: 0, ZIYADAH: 0, INTENS: 0, BACAAN: 0 }
            ),
          };
        }
      });

      if (Object.keys(filteredSantriGroup).length > 0) {
        result[halaqahName] = { ...group, santriGroup: filteredSantriGroup };
      }
    });

    return result;
  }, [groupedDataRaw, filters, effectiveActiveHalaqah]);

  // List santri unik dari grouped raw (semua halaqah yg relevan)
  const santriNames = useMemo(() => {
    const names = new Set<string>();
    Object.entries(groupedDataRaw).forEach(([halaqahName, group]: [string, GroupedHalaqahItem]) => {
      if (
        effectiveActiveHalaqah !== "all" &&
        effectiveActiveHalaqah !== "" &&
        halaqahName !== effectiveActiveHalaqah
      ) return;
      Object.values(group.santriGroup).forEach((santri: GroupedSantriItem) => {
        names.add(santri.nama);
      });
    });
    return Array.from(names).sort();
  }, [groupedDataRaw, effectiveActiveHalaqah]);

  const activeHalaqahId = useMemo(() => {
    if (effectiveActiveHalaqah === "all") return null;
    return laporanService.getHalaqahIdByName(listHalaqah, effectiveActiveHalaqah);
  }, [listHalaqah, effectiveActiveHalaqah]);

  const santriForAbsensi = useMemo(() => {
    if (!activeHalaqahId) return [];
    return laporanService.getSantriByHalaqahId(masterSantri, activeHalaqahId);
  }, [masterSantri, activeHalaqahId]);

  // ─── Period label ──────────────────────────────────────────────────────────
  const periodLabel = useMemo(() => {
    const { dateFrom, dateTo, selectedMonth, selectedYear } = filters;

    if (dateFrom || dateTo) {
      const fmt = (d: Date) =>
        d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
      if (dateFrom && dateTo) return `${fmt(dateFrom)} – ${fmt(dateTo)}`;
      if (dateFrom) return `Sejak ${fmt(dateFrom)}`;
      return `Hingga ${fmt(dateTo!)}`;
    }

    if (selectedMonth === null || selectedYear === null) return "Semua Periode";

    return new Date(selectedYear, selectedMonth).toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  }, [filters]);

  // ─── Setters ───────────────────────────────────────────────────────────────
  const setSelectedMonth = useCallback(
    (v: number | null) => setFilters((f) => ({ ...f, selectedMonth: v, dateFrom: null, dateTo: null })),
    []
  );
  const setSelectedYear = useCallback(
    (v: number | null) => setFilters((f) => ({ ...f, selectedYear: v, dateFrom: null, dateTo: null })),
    []
  );
  const setActiveHalaqah = useCallback(
    (v: string) => setFilters((f) => ({ ...f, activeHalaqah: v, selectedSantri: "" })),
    []
  );
  const setSelectedSantri = useCallback(
    (v: string) => setFilters((f) => ({ ...f, selectedSantri: v })),
    []
  );
  const setDateFrom = useCallback(
    (v: Date | null) =>
      setFilters((f) => ({ ...f, dateFrom: v, selectedMonth: null, selectedYear: null })),
    []
  );
  const setDateTo = useCallback(
    (v: Date | null) =>
      setFilters((f) => ({ ...f, dateTo: v, selectedMonth: null, selectedYear: null })),
    []
  );
  const setSelectedKategori = useCallback(
    (v: string) => setFilters((f) => ({ ...f, selectedKategori: v })),
    []
  );
  const resetFilters = useCallback(() => {
    setFilters({
      selectedMonth: new Date().getMonth(),
      selectedYear: new Date().getFullYear(),
      activeHalaqah: halaqahNames[0] ?? "",
      selectedSantri: "",
      dateFrom: null,
      dateTo: null,
      selectedKategori: "",
    });
  }, [halaqahNames]);

  const isFilterActive =
    filters.selectedSantri !== "" ||
    filters.dateFrom !== null ||
    filters.dateTo !== null ||
    filters.selectedKategori !== "" ||
    (effectiveActiveHalaqah !== "" && effectiveActiveHalaqah !== "all");

  return {
    // Raw data
    allSetoran,
    listHalaqah,
    masterSantri,
    loading,

    // Filter state
    filters,
    selectedMonth: filters.selectedMonth,
    selectedYear: filters.selectedYear,
    activeHalaqah: effectiveActiveHalaqah,
    selectedSantri: filters.selectedSantri,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    selectedKategori: filters.selectedKategori,

    // Derived
    groupedData,
    halaqahNames,
    santriNames,
    activeHalaqahId,
    santriForAbsensi,
    periodLabel,
    isFilterActive,

    // Setters
    setSelectedMonth,
    setSelectedYear,
    setActiveHalaqah,
    setSelectedSantri,
    setDateFrom,
    setDateTo,
    setSelectedKategori,
    resetFilters,

    // Actions
    refreshData: fetchData,
  };
};
