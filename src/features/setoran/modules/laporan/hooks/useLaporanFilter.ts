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
}

export function useLaporanFilter() {
  const [filters, setFilters] = useState<LaporanFilter>(DEFAULT_FILTER);

  const setSelectedMonth = useCallback(
    (v: number | null) =>
      setFilters((f) => ({
        ...f,
        selectedMonth: v,
        dateFrom: null,
        dateTo: null,
      })),
    [],
  );
  const setSelectedYear = useCallback(
    (v: number | null) =>
      setFilters((f) => ({
        ...f,
        selectedYear: v,
        dateFrom: null,
        dateTo: null,
      })),
    [],
  );
  const setActiveHalaqah = useCallback(
    (v: string) =>
      setFilters((f) => ({ ...f, activeHalaqah: v, selectedSantri: "" })),
    [],
  );
  const setSelectedSantri = useCallback(
    (v: string) => setFilters((f) => ({ ...f, selectedSantri: v })),
    [],
  );
  const setDateFrom = useCallback(
    (v: Date | null) =>
      setFilters((f) => ({
        ...f,
        dateFrom: v,
        selectedMonth: null,
        selectedYear: null,
      })),
    [],
  );
  const setDateTo = useCallback(
    (v: Date | null) =>
      setFilters((f) => ({
        ...f,
        dateTo: v,
        selectedMonth: null,
        selectedYear: null,
      })),
    [],
  );
  const setSelectedKategori = useCallback(
    (v: string) => setFilters((f) => ({ ...f, selectedKategori: v })),
    [],
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
    setSelectedMonth,
    setSelectedYear,
    setActiveHalaqah,
    setSelectedSantri,
    setDateFrom,
    setDateTo,
    setSelectedKategori,
    resetFilters,
  };
}
