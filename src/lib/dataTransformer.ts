import { parseISO, getMonth, getYear } from "date-fns";

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
  };
}

interface DashboardItem {
  id_setoran?: number; // Tambahan dari backend
  id_santri?: number; // Primary key dari backend
  santri?: SantriBase;
  tanggal_setoran?: string;
  kategori?: string;
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
      totalHafalan: number;
      totalMurajaah: number;
      totalZiyadah: number; // Tambahkan Ziyadah
      santriGroup: {
        [key: number]: {
          nama: string;
          setoran: DashboardItem[];
          stats: { HAFALAN: number; MURAJAAH: number; ZIYADAH: number };
        };
      };
    };
  }

  return filteredData.reduce((acc: AccType, item: DashboardItem) => {
    const halaqahName = item.santri?.halaqah?.name_halaqah || "Tanpa Halaqah";
    const santriId = item.id_santri || 0;
    const santriName = item.santri?.nama_santri || "Nama Tidak Diketahui";
    const kategori = (item.kategori || "HAFALAN").toUpperCase();

    if (!acc[halaqahName]) {
      acc[halaqahName] = {
        name: halaqahName,
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
        stats: { HAFALAN: 0, MURAJAAH: 0, ZIYADAH: 0 },
      };
    }

    acc[halaqahName].santriGroup[santriId].setoran.push(item);

    // Update Global Count
    if (kategori === "HAFALAN") acc[halaqahName].totalHafalan++;
    else if (kategori === "ZIYADAH") acc[halaqahName].totalZiyadah++;
    else acc[halaqahName].totalMurajaah++;

    // Update Santri Stats
    if (
      kategori === "HAFALAN" ||
      kategori === "MURAJAAH" ||
      kategori === "ZIYADAH"
    ) {
      acc[halaqahName].santriGroup[santriId].stats[
        kategori as "HAFALAN" | "MURAJAAH" | "ZIYADAH"
      ]++;
    }

    return acc;
  }, {});
};
