import { createContext, useContext, type ReactNode } from "react";
import { useAbsensiProvider } from "../hooks/useAbsensiProvider";
import { type AbsensiStatusType } from "../validation/absensi.schema";
import { type SesiHalaqah } from "@/types/domain/sesi-halaqah";
import { type Santri } from "@/features/santri";

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
  handleBulkHadir: () => void;
  handleBulkReset: () => void;
  isBulkAllHadir: boolean;
  handleSave: () => Promise<void>;
  isSubmitting: boolean;
}

const AbsensiContext = createContext<AbsensiContextType | undefined>(undefined);

export function AbsensiProvider({ children }: { children: ReactNode }) {
  const absensi = useAbsensiProvider();

  return (
    <AbsensiContext.Provider value={absensi}>
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

