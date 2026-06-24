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
export interface SetoranItem {
  id_setoran: number;
  id_santri: number;
  id_sesi?: number | null;
  tanggal_setoran: string;
  juz: number;
  surat: string;
  ayat: string;
  kategori: KategoriSetoran;
  taqwim?: number | null;
  keterangan?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  santri?: {
    id_santri: number;
    nama_santri: string;
    halaqah?: {
      id_halaqah: number;
      name_halaqah: string;
    } | null;
  } | null;
}

export interface GroupedSantriItem {
  nama: string;
  setoran: SetoranItem[];
  stats: Record<string, number>;
}

export interface GroupedHalaqahItem {
  name: string;
  totalHafalan: number;
  totalMurajaah: number;
  totalZiyadah?: number;
  santriGroup: Record<number, GroupedSantriItem>;
}

export interface GroupedData {
  [halaqahName: string]: GroupedHalaqahItem;
}

export interface EmptyStateProps { isFilterActive?: boolean; message?: string; icon?: React.ReactNode; }
export interface HalaqahSelectorProps { halaqahNames: string[]; activeHalaqah: string; onHalaqahChange: (h: string) => void; }
export interface PeriodSelectorProps { selectedMonth: number | null; selectedYear: number | null; onMonthChange: (m: number | null) => void; onYearChange: (y: number | null) => void; }
export interface SantriAccordionProps { santriGroup: Record<number, GroupedSantriItem>; data?: unknown; halaqahName: string; }
