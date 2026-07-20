import { useState, useCallback } from "react";
import { DEFAULT_FILTER } from "../constants";

export interface LaporanFilter {
  selectedMonth: number | null;
  selectedYear: number | null;
  activeHalaqah: string;
  selectedSantri: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  selectedKategori: string;
  filterMode: "month" | "week" | "range";
  selectedWeek: number | null;
}

export function useLaporanFilter() {
  const [filters, setFilters] = useState<LaporanFilter>(DEFAULT_FILTER);

  const setActiveHalaqah = useCallback(
    (v: string) =>
      setFilters((f) => ({ ...f, activeHalaqah: v, selectedSantri: "" })),
    [],
  );
  const setSelectedSantri = useCallback(
    (v: string) => setFilters((f) => ({ ...f, selectedSantri: v })),
    [],
  );
  const setSelectedKategori = useCallback(
    (v: string) => setFilters((f) => ({ ...f, selectedKategori: v })),
    [],
  );

  const setPeriodFilters = useCallback(
    (
      mode: "month" | "week" | "range",
      payload: {
        selectedMonth: number | null;
        selectedYear: number | null;
        selectedWeek: number | null;
        dateFrom: Date | null;
        dateTo: Date | null;
      }
    ) => {
      setFilters((f) => ({
        ...f,
        filterMode: mode,
        selectedMonth: payload.selectedMonth,
        selectedYear: payload.selectedYear,
        selectedWeek: payload.selectedWeek,
        dateFrom: payload.dateFrom,
        dateTo: payload.dateTo,
      }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTER);
  }, []);

  return {
    filters,
    selectedMonth: filters.selectedMonth,
    selectedYear: filters.selectedYear,
    activeHalaqah: filters.activeHalaqah,
    selectedSantri: filters.selectedSantri,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    selectedKategori: filters.selectedKategori,
    filterMode: filters.filterMode,
    selectedWeek: filters.selectedWeek,
    setActiveHalaqah,
    setSelectedSantri,
    setSelectedKategori,
    setPeriodFilters,
    resetFilters,
  };
}
