export interface DateFilter {
  month: number | null;
  year: number | null;
}

export interface SetoranItem {
  id_setoran?: number;
  santri_id?: number;
  tanggal_setoran?: string;
  juz?: number;
  surat?: string;
  ayat?: string;
  kategori?: string;
  taqwim?: number;
  keterangan?: string;
  santri?: {
    id_santri?: number;
    nama_santri: string;
    deleted_at?: string | null;
    halaqah?: {
      name_halaqah: string;
    };
  };
}

export interface SantriGroup {
  [key: number]: {
    nama: string;
    setoran: SetoranItem[];
    stats: {
      HAFALAN: number;
      MURAJAAH: number;
      ZIYADAH?: number;
      INTENS?: number;
      BACAAN?: number;
    };
  };
}

export interface HalaqahGroup {
  name: string;
  totalHafalan: number;
  totalMurajaah: number;
  santriGroup: SantriGroup;
}

export interface GroupedData {
  [key: string]: HalaqahGroup;
}

export interface SantriAccordionProps {
  santriGroup: SantriGroup;
}

export interface EmptyStateProps {
  isFilterActive: boolean;
}

export interface PeriodSelectorProps {
  selectedMonth: number | null;
  selectedYear: number | null;
  onMonthChange: (month: number | null) => void;
  onYearChange: (year: number | null) => void;
}

export interface HalaqahSelectorProps {
  halaqahNames: string[];
  activeHalaqah: string;
  onHalaqahChange: (value: string) => void;
}

// Constants
export const MONTHS = [
  { label: "Semua Bulan", value: "all" },
  { label: "Januari", value: "0" }, { label: "Februari", value: "1" },
  { label: "Maret", value: "2" }, { label: "April", value: "3" },
  { label: "Mei", value: "4" }, { label: "Juni", value: "5" },
  { label: "Juli", value: "6" }, { label: "Agustus", value: "7" },
  { label: "September", value: "8" }, { label: "Oktober", value: "9" },
  { label: "November", value: "10" }, { label: "Desember", value: "11" },
];

export const currentYear = new Date().getFullYear();
export const years = Array.from({ length: 5 }, (_, i) => currentYear - i);