import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { useSantri } from "@/features/santri";
import { useAbsensiUrlState } from "./use-absensi-url-state";
import { useSesiHalaqahQuery, useAbsensiSesiQuery, useAbsensiMutation } from "../api";
import { type AbsensiStatusType, bulkCreateAbsensiSantriSchema } from "../validation/absensi.schema";
import { toast } from "sonner";

export function useAbsensiProvider() {
  const { halaqahId: paramHalaqahId } = useParams();
  const halaqahId = paramHalaqahId ? Number(paramHalaqahId) : undefined;

  const urlState = useAbsensiUrlState();
  const { santriList, loadSantri, isLoading: loadingSantri } = useSantri();
  
  // Local state for draft attendance
  const [attendanceMap, setAttendanceMap] = useState<Record<number, AbsensiStatusType>>({});

  // Queries & Mutations
  const { data: sesiList = [] } = useSesiHalaqahQuery();
  const { data: sesiAbsensiRecords = [], isLoading: isLoadingSync } = useAbsensiSesiQuery(
    urlState.selectedSesi,
    urlState.selectedDate
  );
  const { submitAbsensiBulk, isSubmitting } = useAbsensiMutation();

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
      const currentSelectedSesiObj = filteredSesiList.find(s => s.id_sesi === urlState.selectedSesi);
      const jsDay = urlState.selectedDate.getDay();
      const mappedDay = jsDay === 0 ? 7 : jsDay;
      const isCurrentSesiValidForDate = currentSelectedSesiObj && (
        !currentSelectedSesiObj.hari || 
        currentSelectedSesiObj.hari.length === 0 || 
        currentSelectedSesiObj.hari.includes(mappedDay)
      );

      if (!currentSelectedSesiObj || !isCurrentSesiValidForDate) {
        // Cari sesi yang valid untuk hari terpilih terlebih dahulu
        const validSesi = filteredSesiList.find(s => 
          !s.hari || 
          s.hari.length === 0 || 
          s.hari.includes(mappedDay)
        );
        if (validSesi) {
          urlState.setSelectedSesi(validSesi.id_sesi);
        } else if (!currentSelectedSesiObj) {
          urlState.setSelectedSesi(filteredSesiList[0].id_sesi);
        }
      }
    } else if (sesiList.length > 0 && uniqueHalaqahIds.length > 0) {
      urlState.setSelectedSesi(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredSesiList, sesiList.length, uniqueHalaqahIds.length, urlState.selectedDate]);

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

  const handleBulkHadir = () => {
    const bulk: Record<number, AbsensiStatusType> = {};
    // Hanya mark santri yang relevan dengan halaqah yang sedang aktif
    const targetSantri = halaqahId
      ? santriList.filter((s) => s.id_halaqah === halaqahId)
      : santriList;
    targetSantri.forEach((s) => {
      bulk[s.id_santri] = "HADIR";
    });
    setAttendanceMap(bulk);
  };

  const handleBulkReset = () => setAttendanceMap({});

  const isBulkAllHadir = useMemo(
    () =>
      santriList.length > 0 &&
      santriList.every(
        (s) =>
          attendanceMap[s.id_santri] === "HADIR" ||
          submittedAttendance[s.id_santri] === "HADIR"
      ),
    [santriList, attendanceMap, submittedAttendance]
  );

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

    // Client-side Zod validation
    const validation = bulkCreateAbsensiSantriSchema.safeParse(payloads);
    if (!validation.success) {
      toast.error("Data absensi tidak valid");
      return;
    }

    try {
      await submitAbsensiBulk(validation.data);
      setAttendanceMap({}); // Kosongkan draft setelah berhasil
    } catch (error) {
      console.error(error);
    }
  };

  return {
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
    handleBulkHadir,
    handleBulkReset,
    isBulkAllHadir,
    handleSave,
    isSubmitting,
  };
}
