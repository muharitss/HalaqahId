import { useMemo } from "react";
import { useLaporanDataQuery } from "../api/queries";
import {
  useLaporanFilter,
  useLaporanGrouping,
  useLaporanStats,
} from "../modules/laporan/hooks";
import { laporanService } from "../api/laporanService";

export function useLaporanData() {
  const { data, isLoading: loading, refetch: refreshData } = useLaporanDataQuery();
  const {
    filters,
    selectedMonth,
    selectedYear,
    activeHalaqah: rawActiveHalaqah,
    selectedSantri,
    dateFrom,
    dateTo,
    selectedKategori,
    filterMode,
    selectedWeek,
    setActiveHalaqah,
    setSelectedSantri,
    setSelectedKategori,
    setPeriodFilters,
    resetFilters,
  } = useLaporanFilter();

  const {
    allSetoran = [],
    listHalaqah = [],
    masterSantri = [],
    kategoriList = [],
  } = data || {};

  const kategoriNames = useMemo(() => {
    return kategoriList.map((k) => k.nama_kategori);
  }, [kategoriList]);

  const halaqahNamesFromGrouping = useMemo(() => {
    // We need a temporary way to get halaqah names for effectiveActiveHalaqah
    // before useLaporanGrouping is called
    const enrichedSetoran = allSetoran.map((item) => {
      if (!item.santri?.halaqah) return item;
      const halaqahId = item.santri.halaqah.id_halaqah;
      const rawName = item.santri.halaqah.name_halaqah || "Tanpa Halaqah";
      const match = listHalaqah.find((h) => {
        if (halaqahId !== undefined && halaqahId !== null && halaqahId !== 0) {
          return h.id_halaqah === halaqahId;
        }
        return h.santri?.some((s: any) => s.id_santri === item.id_santri);
      });
      const muhafizName = match?.muhafiz?.name || "";
      const displayHalaqahName = muhafizName
        ? `${rawName} - ${muhafizName}`
        : rawName;
      return {
        ...item,
        santri: {
          ...item.santri,
          halaqah: {
            ...item.santri.halaqah,
            name_halaqah: displayHalaqahName,
            user: { name: muhafizName },
          },
        },
      };
    });
    const dateFilter =
      filters.dateFrom || filters.dateTo
        ? { month: null, year: null }
        : { month: filters.selectedMonth, year: filters.selectedYear };
    const groupedDataRaw = laporanService.transformSetoranData(
      enrichedSetoran,
      dateFilter
    );
    return laporanService.getHalaqahNames(groupedDataRaw);
  }, [allSetoran, listHalaqah, filters]);

  const effectiveActiveHalaqah = useMemo(() => {
    if (rawActiveHalaqah === "all" || rawActiveHalaqah === "") return "all";
    if (
      halaqahNamesFromGrouping.length > 0 &&
      !halaqahNamesFromGrouping.includes(rawActiveHalaqah)
    ) {
      return "all";
    }
    return rawActiveHalaqah;
  }, [rawActiveHalaqah, halaqahNamesFromGrouping]);

  const {
    groupedDataRaw,
    halaqahNames,
    halaqahMuhafizMap,
    santriNames,
    activeHalaqahId,
  } = useLaporanGrouping({
    allSetoran,
    listHalaqah,
    filters,
    effectiveActiveHalaqah,
  });

  const { groupedData, periodLabel, isFilterActive } = useLaporanStats({
    groupedDataRaw,
    filters,
    effectiveActiveHalaqah,
  });

  const santriForAbsensi = useMemo(() => {
    if (!activeHalaqahId) return [];
    return laporanService.getSantriByHalaqahId(masterSantri, activeHalaqahId);
  }, [masterSantri, activeHalaqahId]);

  return {
    // Raw data
    allSetoran,
    listHalaqah,
    masterSantri,
    kategoriNames,
    loading,

    // Filter state
    filters,
    selectedMonth,
    selectedYear,
    activeHalaqah: effectiveActiveHalaqah,
    selectedSantri,
    dateFrom,
    dateTo,
    selectedKategori,
    filterMode,
    selectedWeek,

    // Derived
    groupedData,
    halaqahNames,
    halaqahMuhafizMap,
    santriNames,
    activeHalaqahId,
    santriForAbsensi,
    periodLabel,
    isFilterActive,

    // Setters
    setActiveHalaqah,
    setSelectedSantri,
    setSelectedKategori,
    setPeriodFilters,
    resetFilters,

    // Actions
    refreshData,
  };
}
