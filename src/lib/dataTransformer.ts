import { parseISO, getMonth, getYear } from "date-fns";

export const sanitizeDashboardData = (data: any[]) => {
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

export const transformSetoranData = (data: any[], filterDate?: Date) => {
  // Bersihkan data santri yang sudah dihapus terlebih dahulu
  const cleanData = sanitizeDashboardData(data);

  const filteredData = cleanData.filter((item) => {
    if (!filterDate) return true;
    const itemDate = parseISO(item.tanggal_setoran);
    return (
      getMonth(itemDate) === getMonth(filterDate) &&
      getYear(itemDate) === getYear(filterDate)
    );
  });

  return filteredData.reduce((acc: any, item: any) => {
    const halaqahName = item.santri?.halaqah?.name_halaqah || "Tanpa Halaqah";
    const santriId = item.santri_id;
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
    acc[halaqahName].santriGroup[santriId].stats[kategori]++;

    return acc;
  }, {});
};