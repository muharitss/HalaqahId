import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { format, isValid, parseISO } from "date-fns";

export function useAbsensiUrlState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = searchParams.get("tab") || "input";
  
  const fallbackDate = useMemo(() => new Date(), []);
  const dateParam = searchParams.get("date");
  const selectedDate = useMemo(() => {
    if (!dateParam) return fallbackDate;
    const parsed = parseISO(dateParam);
    return isValid(parsed) ? parsed : fallbackDate;
  }, [dateParam, fallbackDate]);
  
  const sesiParam = searchParams.get("sesi");
  const selectedSesi = sesiParam ? Number(sesiParam) : null;

  // Rekap states
  const fallbackViewDate = useMemo(() => new Date(), []);
  const viewDateParam = searchParams.get("viewDate");
  const viewDate = useMemo(() => {
    if (!viewDateParam) return fallbackViewDate;
    const parsed = parseISO(viewDateParam);
    return isValid(parsed) ? parsed : fallbackViewDate;
  }, [viewDateParam, fallbackViewDate]);

  // Updaters
  const setTab = (newTab: string) => {
    setSearchParams((prev) => {
      prev.set("tab", newTab);
      return prev;
    }, { replace: true });
  };

  const setSelectedDate = (date: Date) => {
    setSearchParams((prev) => {
      prev.set("date", format(date, "yyyy-MM-dd"));
      return prev;
    }, { replace: true });
  };

  const setSelectedSesi = (sesiId: number | null) => {
    setSearchParams((prev) => {
      if (sesiId) {
        prev.set("sesi", sesiId.toString());
      } else {
        prev.delete("sesi");
      }
      return prev;
    }, { replace: true });
  };

  const setViewDate = (date: Date) => {
    setSearchParams((prev) => {
      prev.set("viewDate", format(date, "yyyy-MM-dd"));
      return prev;
    }, { replace: true });
  };

  return {
    tab, setTab,
    selectedDate, setSelectedDate,
    selectedSesi, setSelectedSesi,
    viewDate, setViewDate
  };
}
