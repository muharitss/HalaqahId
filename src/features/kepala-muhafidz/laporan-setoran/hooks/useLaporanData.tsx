import { useState, useEffect, useMemo, useCallback } from "react";
import { laporanService } from "../services/laporanService";

export const useLaporanData = () => {
  const [allSetoran, setAllSetoran] = useState<any[]>([]);
  const [listHalaqah, setListHalaqah] = useState<any[]>([]);
  const [masterSantri, setMasterSantri] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number | null>(new Date().getFullYear());
  const [activeHalaqah, setActiveHalaqah] = useState<string>("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [setoranData, halaqahData, santriData] = await Promise.all([
        laporanService.getAllSetoran(),
        laporanService.getAllHalaqah(),
        laporanService.getAllSantri()
      ]);

      setAllSetoran(setoranData);
      setListHalaqah(halaqahData);
      setMasterSantri(santriData);
    } catch (error) {
      console.error("Gagal mengambil data laporan:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const groupedData = useMemo(() => {
    const filter = {
      month: selectedMonth,
      year: selectedYear,
    };
    return laporanService.transformSetoranData(allSetoran, filter);
  }, [allSetoran, selectedMonth, selectedYear]);

  const halaqahNames = useMemo(() => {
    return laporanService.getHalaqahNames(groupedData);
  }, [groupedData]);

  useEffect(() => {
    if (halaqahNames.length > 0 && (!activeHalaqah || !halaqahNames.includes(activeHalaqah))) {
      setActiveHalaqah(halaqahNames[0]);
    }
  }, [halaqahNames, activeHalaqah]);

  const activeHalaqahId = useMemo(() => {
    return laporanService.getHalaqahIdByName(listHalaqah, activeHalaqah);
  }, [listHalaqah, activeHalaqah]);

  const santriForAbsensi = useMemo(() => {
    if (!activeHalaqahId) return [];
    return laporanService.getSantriByHalaqahId(masterSantri, activeHalaqahId);
  }, [masterSantri, activeHalaqahId]);

  const periodLabel = useMemo(() => {
    if (selectedMonth === null || selectedYear === null) {
      return "Semua Periode";
    }
    return new Date(selectedYear, selectedMonth).toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric"
    });
  }, [selectedMonth, selectedYear]);

  const resetFilters = () => {
    setSelectedMonth(null);
    setSelectedYear(null);
  };

  return {
    // State
    allSetoran,
    listHalaqah,
    masterSantri,
    loading,
    selectedMonth,
    selectedYear,
    activeHalaqah,
    groupedData,
    halaqahNames,
    activeHalaqahId,
    santriForAbsensi,
    periodLabel,

    // Setters
    setSelectedMonth,
    setSelectedYear,
    setActiveHalaqah,
    resetFilters,

    // Actions
    refreshData: fetchData,
  };
};