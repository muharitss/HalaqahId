import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { MONTHS } from "../constants";

interface UsePeriodFilterProps {
  filterMode: "month" | "week" | "range";
  selectedMonth: number | null;
  selectedYear: number | null;
  selectedWeek: number | null;
  dateFrom: Date | null;
  dateTo: Date | null;
  onPeriodChange: (
    mode: "month" | "week" | "range",
    payload: {
      selectedMonth: number | null;
      selectedYear: number | null;
      selectedWeek: number | null;
      dateFrom: Date | null;
      dateTo: Date | null;
    }
  ) => void;
}

export function usePeriodFilter({
  filterMode,
  selectedMonth,
  selectedYear,
  selectedWeek,
  dateFrom,
  dateTo,
  onPeriodChange,
}: UsePeriodFilterProps) {
  // Period Popover & Local Temp States
  const [periodOpen, setPeriodOpen] = useState(false);
  const [tempMode, setTempMode] = useState<"month" | "week" | "range">(filterMode || "month");
  const [tempMonth, setTempMonth] = useState<number | null>(selectedMonth);
  const [tempYear, setTempYear] = useState<number | null>(selectedYear);
  const [tempWeek, setTempWeek] = useState<number | null>(selectedWeek);
  const [tempDateFrom, setTempDateFrom] = useState<Date | null>(dateFrom);
  const [tempDateTo, setTempDateTo] = useState<Date | null>(dateTo);

  const [calFromOpen, setCalFromOpen] = useState(false);
  const [calToOpen, setCalToOpen] = useState(false);

  const resetTempValues = () => {
    setTempMode(filterMode || "month");
    setTempMonth(selectedMonth);
    setTempYear(selectedYear);
    setTempWeek(selectedWeek);
    setTempDateFrom(dateFrom);
    setTempDateTo(dateTo);
  };

  // Sync temp values whenever props or popover state changes
  useEffect(() => {
    if (!periodOpen) {
      resetTempValues();
    }
  }, [selectedMonth, selectedYear, selectedWeek, dateFrom, dateTo, filterMode, periodOpen]);

  const handleModeChange = (mode: "month" | "week" | "range") => {
    setTempMode(mode);
    // Auto-populate sensible defaults if currently empty
    if (mode === "month" || mode === "week") {
      if (tempMonth === null) setTempMonth(new Date().getMonth());
      if (tempYear === null) setTempYear(new Date().getFullYear());
      if (mode === "week" && tempWeek === null) setTempWeek(1);
    } else if (mode === "range") {
      if (!tempDateFrom) setTempDateFrom(new Date());
      if (!tempDateTo) setTempDateTo(new Date());
    }
  };

  const getWeekDateRange = (year: number, month: number, week: number) => {
    const startDay = (week - 1) * 7 + 1;
    let endDay = week * 7;
    
    // Pekan 5 spans until the end of the month
    if (week === 5) {
      const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
      endDay = lastDayOfMonth;
    }
    
    const fromDate = new Date(year, month, startDay, 0, 0, 0, 0);
    const toDate = new Date(year, month, endDay, 23, 59, 59, 999);
    
    return { fromDate, toDate };
  };

  const handleApplyPeriod = () => {
    if (tempMode === "month") {
      onPeriodChange("month", {
        selectedMonth: tempMonth,
        selectedYear: tempYear,
        selectedWeek: null,
        dateFrom: null,
        dateTo: null,
      });
    } else if (tempMode === "week") {
      if (tempYear !== null && tempMonth !== null && tempWeek !== null) {
        const { fromDate, toDate } = getWeekDateRange(tempYear, tempMonth, tempWeek);
        onPeriodChange("week", {
          selectedMonth: tempMonth,
          selectedYear: tempYear,
          selectedWeek: tempWeek,
          dateFrom: fromDate,
          dateTo: toDate,
        });
      }
    } else if (tempMode === "range") {
      onPeriodChange("range", {
        selectedMonth: null,
        selectedYear: null,
        selectedWeek: null,
        dateFrom: tempDateFrom,
        dateTo: tempDateTo,
      });
    }
    setPeriodOpen(false);
  };

  const getPeriodTriggerLabel = () => {
    if (filterMode === "range") {
      if (dateFrom && dateTo) {
        return `${format(dateFrom, "dd MMM", { locale: idLocale })} – ${format(dateTo, "dd MMM yyyy", { locale: idLocale })}`;
      }
      if (dateFrom) return `Sejak ${format(dateFrom, "dd MMM yyyy", { locale: idLocale })}`;
      if (dateTo) return `Hingga ${format(dateTo, "dd MMM yyyy", { locale: idLocale })}`;
      return "Pilih Rentang Tanggal";
    }

    if (filterMode === "week") {
      if (selectedWeek !== null && selectedMonth !== null && selectedYear !== null) {
        const monthName = MONTHS[selectedMonth];
        return `Pek. ${selectedWeek} (${monthName} ${selectedYear})`;
      }
      return "Pilih Pekan";
    }

    // mode === "month"
    if (selectedMonth !== null && selectedYear !== null) {
      return `${MONTHS[selectedMonth]} ${selectedYear}`;
    }
    if (selectedYear !== null) {
      return `Tahun ${selectedYear}`;
    }
    return "Semua Periode";
  };

  const daysInMonth = tempYear && tempMonth !== null ? new Date(tempYear, tempMonth + 1, 0).getDate() : 31;

  return {
    periodOpen,
    setPeriodOpen,
    tempMode,
    setTempMode,
    tempMonth,
    setTempMonth,
    tempYear,
    setTempYear,
    tempWeek,
    setTempWeek,
    tempDateFrom,
    setTempDateFrom,
    tempDateTo,
    setTempDateTo,
    calFromOpen,
    setCalFromOpen,
    calToOpen,
    setCalToOpen,
    daysInMonth,
    handleModeChange,
    handleApplyPeriod,
    getPeriodTriggerLabel,
    resetTempValues,
  };
}
