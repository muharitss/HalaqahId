import { createContext, useContext, useState, useMemo, useEffect, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { useSantri } from "@/features/santri/hooks/useSantri";
import { useAbsensiUrlState } from "../hooks/use-absensi-url-state";
import { useSesiHalaqahQuery, useAbsensiSesiQuery } from "../hooks/use-absensi-query";
import { useAbsensiMutation } from "../hooks/use-absensi-mutation";
import { type AbsensiStatusType } from "../types/absensi.schema";
import { type SesiHalaqah } from "@/types/domain/sesi-halaqah";
import { type Santri } from "@/features/santri/types";

interface AbsensiContextType {
  // Global / Route state
  halaqahId?: number;
  tab: string;
  setTab: (tab: string) => void;
  
  // Data
  santriList: Santri[];
  loadingSantri: boolean;
  
  // Input State
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectedSesi: number | null;
  setSelectedSesi: (sesi: number | null) => void;
  
  filteredSesiList: SesiHalaqah[];
  currentSesiObj?: SesiHalaqah;
  isDateValidForSesi: boolean;
  
  attendanceMap: Record<number, AbsensiStatusType>;
  submittedAttendance: Record<number, AbsensiStatusType>;
  isLoadingSync: boolean;
  
  // Rekap State
  viewDate: Date;
  setViewDate: (date: Date) => void;

  // Actions
  handleStatusChange: (id: number, status: AbsensiStatusType) => void;
  handleSave: () => Promise<void>;
  isSubmitting: boolean;
}

const AbsensiContext = createContext<AbsensiContextType | undefined>(undefined);

export function AbsensiProvider({ children }: { children: ReactNode }) {
  const { halaqahId: paramHalaqahId } = useParams();
  const halaqahId = paramHalaqahId ? Number(paramHalaqahId) : undefined;

  const urlState = useAbsensiUrlState();
  const { santriList, loadSantri, isLoading: loadingSantri } = useSantri();
  
  // Local state for draft attendance
  const [attendanceMap, setAttendanceMap] = useState<Record<number, AbsensiStatusType>>({});

  // Queries & Mutations
  const { data: sesiList = [] } = useSesiHalaqahQuery();
  const { data: sesiAbsensiRecords = [], isFetching: isLoadingSync } = useAbsensiSesiQuery(
    urlState.selectedSesi,
    urlState.selectedDate
  );
  const { submitAbsensiBulk, isSubmitting } = useAbsensiMutation();

  // Load Santri
  useEffect(() => {
    loadSantri();
  }, [loadSantri]);

  // Derived Sesi Data
  const uniqueHalaqahIds = useMemo(() => {
    if (halaqahId) return [halaqahId];
    return Array.from(new Set(santriList.map((s) => s.id_halaqah).filter(Boolean)));
  }, [halaqahId, santriList]);

  const filteredSesiList = useMemo(() => {
    return sesiList.filter(
      (sesi) => !sesi.halaqahs || sesi.halaqahs.length === 0 || sesi.halaqahs.some(h => uniqueHalaqahIds.includes(h.id_halaqah))
    );
  }, [sesiList, uniqueHalaqahIds]);

  const currentSesiObj = useMemo(() => {
    return filteredSesiList.find((s) => s.id_sesi === urlState.selectedSesi);
  }, [filteredSesiList, urlState.selectedSesi]);

  const isDateValidForSesi = useMemo(() => {
    if (!currentSesiObj || !currentSesiObj.hari || currentSesiObj.hari.length === 0) return true;
    const jsDay = urlState.selectedDate.getDay();
    const mappedDay = jsDay === 0 ? 7 : jsDay;
    return currentSesiObj.hari.includes(mappedDay);
  }, [currentSesiObj, urlState.selectedDate]);

  // Handle otomatisasi pilihan Sesi
  useEffect(() => {
    if (filteredSesiList.length > 0) {
      const isSelectedValid = filteredSesiList.some(s => s.id_sesi === urlState.selectedSesi);
      if (!isSelectedValid) {
        urlState.setSelectedSesi(filteredSesiList[0].id_sesi);
      }
    } else if (sesiList.length > 0 && uniqueHalaqahIds.length > 0) {
      urlState.setSelectedSesi(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredSesiList, sesiList.length, uniqueHalaqahIds.length]);

  // Sync Submitted Attendance
  const submittedAttendance = useMemo(() => {
    const map: Record<number, AbsensiStatusType> = {};
    sesiAbsensiRecords.forEach((rec) => {
      map[rec.id_santri] = rec.status;
    });
    return map;
  }, [sesiAbsensiRecords]);

  // Clear draft when selected date or sesi changes
  useEffect(() => {
    setAttendanceMap({});
  }, [urlState.selectedDate, urlState.selectedSesi]);

  // Actions
  const handleStatusChange = (id: number, status: AbsensiStatusType) => {
    setAttendanceMap((prev) => {
      if (prev[id] === status) {
        const newMap = { ...prev };
        delete newMap[id];
        return newMap;
      }
      return { ...prev, [id]: status };
    });
  };

  const handleSave = async () => {
    const draftEntries = Object.entries(attendanceMap);
    if (draftEntries.length === 0) return;

    const payloads = draftEntries.map(([id, status]) => ({
      id_santri: Number(id),
      id_sesi: urlState.selectedSesi!,
      status,
      tanggal: format(urlState.selectedDate, "yyyy-MM-dd"),
      keterangan: "-",
    }));

    try {
      await submitAbsensiBulk(payloads);
      setAttendanceMap({}); // Kosongkan draft setelah berhasil
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AbsensiContext.Provider
      value={{
        halaqahId,
        ...urlState,
        santriList,
        loadingSantri,
        filteredSesiList,
        currentSesiObj,
        isDateValidForSesi,
        attendanceMap,
        submittedAttendance,
        isLoadingSync,
        handleStatusChange,
        handleSave,
        isSubmitting,
      }}
    >
      {children}
    </AbsensiContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAbsensi() {
  const context = useContext(AbsensiContext);
  if (!context) {
    throw new Error("useAbsensi must be used within an AbsensiProvider");
  }
  return context;
}
