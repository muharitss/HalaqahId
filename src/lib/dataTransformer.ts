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
  santri?: SantriBase;
  santri_id?: number;
  tanggal_setoran?: string;
  kategori?: string;
  status?: string;
}

export const sanitizeDashboardData = <T extends DashboardItem>(data: T[]): T[] => {
  if (!data || !Array.isArray(data)) return [];

  return data.filter((item) => {
    if (!item.santri) return false;

    if (!item.santri.nama_santri) return false;

    if (item.santri.deleted_at !== undefined && item.santri.deleted_at !== null) {
      return false;
    }

    if (!item.santri_id || item.santri_id === 0) return false;

    return true;
  });
};


export const transformSetoranData = (data: DashboardItem[], filter?: DateFilter) => {
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
      santriGroup: {
        [key: number]: {
          nama: string;
          setoran: DashboardItem[];
          stats: { HAFALAN: number; MURAJAAH: number };
        };
      };
    };
  }

  return filteredData.reduce((acc: AccType, item: DashboardItem) => {
    const halaqahName = item.santri?.halaqah?.name_halaqah || "Tanpa Halaqah";
    const santriId = item.santri_id || 0;
    const santriName = item.santri?.nama_santri || "Nama Tidak Diketahui";

    if (!acc[halaqahName]) {
      acc[halaqahName] = {
        name: halaqahName,
        totalHafalan: 0,
        totalMurajaah: 0,
        santriGroup: {}
      };
    }

    if (!acc[halaqahName].santriGroup[santriId]) {
      acc[halaqahName].santriGroup[santriId] = {
        nama: santriName,
        setoran: [],
        stats: { HAFALAN: 0, MURAJAAH: 0 }
      };
    }

    acc[halaqahName].santriGroup[santriId].setoran.push(item);
    
    if (item.kategori === "HAFALAN") acc[halaqahName].totalHafalan++;
    else acc[halaqahName].totalMurajaah++;

    const kategori = item.kategori as "HAFALAN" | "MURAJAAH";
    if (kategori === "HAFALAN" || kategori === "MURAJAAH") {
      acc[halaqahName].santriGroup[santriId].stats[kategori]++;
    }

    return acc;
  }, {});
};
