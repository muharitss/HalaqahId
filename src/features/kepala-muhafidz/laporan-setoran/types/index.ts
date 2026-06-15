import type { Setoran } from '@/types';

export type SetoranItem = Setoran;

export interface DateFilter {
  month: number | null;
  year: number | null;
}

export interface GroupedData {
  [halaqahName: string]: {
    name: string;
    totalHafalan: number;
    totalMurajaah: number;
    totalZiyadah: number;
    santriGroup: {
      [santriId: number]: {
        nama: string;
        setoran: SetoranItem[];
        stats: {
          HAFALAN: number;
          MURAJAAH: number;
          ZIYADAH: number;
        };
      };
    };
  };
}

export interface SantriAccordionProps {
  santriGroup: GroupedData[string]['santriGroup'];
}

export interface HalaqahSelectorProps {
  halaqahNames: string[];
  activeHalaqah: string;
  onHalaqahChange: (name: string) => void;
}

export interface PeriodSelectorProps {
  selectedMonth: number | null;
  selectedYear: number | null;
  onMonthChange: (month: number | null) => void;
  onYearChange: (year: number | null) => void;
}

export interface EmptyStateProps {
  isFilterActive: boolean;
}
