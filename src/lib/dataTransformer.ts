import { parseISO, getMonth, getYear } from "date-fns";
import type { SetoranItem } from "@/features/setoran/types";

interface DateFilter {
  month: number | null;
  year: number | null;
}

interface SantriBase {
  id_santri?: number;
  nama_santri: string;
  deleted_at?: string | null;
  halaqah?: {
    name_halaqah: string;
  } | null;
}

interface DashboardItem {
  id_setoran?: number; // Tambahan dari backend
  id_santri?: number; // Primary key dari backend
  santri?: SantriBase | null;
  tanggal_setoran?: string;
  kategori?: string | { id_kategori: number; nama_kategori: string; perlu_validasi_urutan?: boolean; };
  status?: string;
}

export const sanitizeDashboardData = <T extends DashboardItem>(
  data: T[],
): T[] => {
  if (!data || !Array.isArray(data)) return [];

  return data.filter((item) => {
    // 1. Cek objek santri
    if (!item.santri) return false;

    // 2. Cek nama santri
    if (!item.santri.nama_santri) return false;

    // 3. Cek soft delete
    if (
      item.santri.deleted_at !== undefined &&
      item.santri.deleted_at !== null
    ) {
      return false;
    }

    // 4. FIX: Gunakan id_santri sesuai format backend
    const currentId = item.id_santri;
    if (!currentId || currentId === 0) return false;

    return true;
  });
};

export const transformSetoranData = (
  data: DashboardItem[],
  filter?: DateFilter,
) => {
  const cleanData = sanitizeDashboardData(data);

  const filteredData = cleanData.filter((item) => {
    if (!filter || (filter.month === null && filter.year === null)) return true;
    if (!item.tanggal_setoran) return false;

    const itemDate = parseISO(item.tanggal_setoran);
    const itemMonth = getMonth(itemDate);
    const itemYear = getYear(itemDate);

    const monthMatch = filter.month === null || itemMonth === filter.month;
    const yearMatch = filter.year === null || itemYear === filter.year;

    return monthMatch && yearMatch;
  });

  interface AccType {
    [key: string]: {
      name: string;
      muhafizName?: string;
      totalHafalan: number;
      totalMurajaah: number;
      totalZiyadah: number;
      santriGroup: {
        [key: number]: {
          nama: string;
          setoran: SetoranItem[];
          stats: Record<string, number>;
        };
      };
    };
  }

  return (filteredData as unknown as SetoranItem[]).reduce((acc: AccType, item: SetoranItem) => {
    const halaqahName = item.santri?.halaqah?.name_halaqah || "Tanpa Halaqah";
    const muhafizName = item.santri?.halaqah?.user?.name || "";
    const santriId = item.id_santri || 0;
    const santriName = item.santri?.nama_santri || "Nama Tidak Diketahui";
    
    // Resolusi nama kategori baik format objek (relasi baru) maupun string (legacy)
    const rawKategori = item.kategori;
    const kategoriName = typeof rawKategori === 'object' && rawKategori && 'nama_kategori' in rawKategori
      ? (rawKategori as { nama_kategori: string }).nama_kategori
      : rawKategori;
    const kategori = (kategoriName || "HAFALAN").toUpperCase();

    if (!acc[halaqahName]) {
      acc[halaqahName] = {
        name: halaqahName,
        muhafizName,
        totalHafalan: 0,
        totalMurajaah: 0,
        totalZiyadah: 0,
        santriGroup: {},
      };
    }

    if (!acc[halaqahName].santriGroup[santriId]) {
      acc[halaqahName].santriGroup[santriId] = {
        nama: santriName,
        setoran: [],
        stats: {},
      };
    }

    acc[halaqahName].santriGroup[santriId].setoran.push(item);

    // Update Global Count (Prioritas pencocokan kata kunci)
    if (kategori.includes("HAFALAN")) acc[halaqahName].totalHafalan++;
    else if (kategori.includes("ZIYADAH")) acc[halaqahName].totalZiyadah++;
    else if (kategori.includes("MURAJAAH")) acc[halaqahName].totalMurajaah++;
    else acc[halaqahName].totalMurajaah++; // Fallback

    // Update Santri Stats secara dinamis
    acc[halaqahName].santriGroup[santriId].stats[kategori] = 
      (acc[halaqahName].santriGroup[santriId].stats[kategori] || 0) + 1;

    return acc;
  }, {});
};
