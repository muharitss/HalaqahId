// Export semua type yang dibutuhkan
export type KategoriSetoran =
  | "HAFALAN"
  | "MURAJAAH"
  | "ZIYADAH"
  | "INTENS"
  | "BACAAN";

export interface SetoranPayload {
  id_santri: number;
  id_sesi?: number;
  juz: number;
  surat: string;
  ayat: string;
  kategori: KategoriSetoran;
  taqwim?: number;
  keterangan?: string;
}

export interface SetoranRecord {
  id_setoran: number;
  id_santri: number;
  id_sesi?: number;
  tanggal_setoran: string;
  juz: number;
  surat: string;
  ayat: string;
  kategori: KategoriSetoran;
  taqwim: number;
  keterangan: string;
  nilai: number;
  santri?: {
    nama_santri: string;
  };
}

export interface SetoranFormValues {
  id_santri: number;
  id_sesi?: number;
  juz: number;
  surat: string;
  ayat_mulai: number;
  ayat_selesai: number;
  kategori: KategoriSetoran;
  taqwim?: number;
  keterangan?: string;
}

export interface DateFilter { month: number | null; year: number | null; }
export interface GroupedData { [key: string]: any; }
export interface SetoranItem { [key: string]: any; }
export interface EmptyStateProps { isFilterActive?: boolean; message?: string; icon?: React.ReactNode; }
export interface HalaqahSelectorProps { halaqahNames: string[]; activeHalaqah: string; onHalaqahChange: (h: string) => void; }
export interface PeriodSelectorProps { selectedMonth: number | null; selectedYear: number | null; onMonthChange: (m: number | null) => void; onYearChange: (y: number | null) => void; }
export interface SantriAccordionProps { santriGroup: any; data: any; halaqahName: string; }
