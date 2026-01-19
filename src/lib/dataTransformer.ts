import { parseISO, getMonth, getYear } from "date-fns";

/**
 * @param data - Array data setoran dari API
 * @param filterDate - Objek Date dari state (Bulan & Tahun). Jika undefined, maka ambil semua.
 */
export const transformSetoranData = (data: any[], filterDate?: Date) => {
  // 1. Lakukan filtering di awal (Hanya sekali jalan)
  const filteredData = data.filter((item) => {
    if (!filterDate) return true; // Jika filterDate undefined (Mode "Semua"), loloskan semua

    const itemDate = parseISO(item.tanggal_setoran);
    return (
      getMonth(itemDate) === getMonth(filterDate) &&
      getYear(itemDate) === getYear(filterDate)
    );
  });

  // 2. Lakukan grouping pada data yang sudah di-filter
  return filteredData.reduce((acc: any, item: any) => {
    const halaqahName = item.santri?.halaqah?.name_halaqah || "Tanpa Halaqah";
    const santriId = item.santri_id;
    const santriName = item.santri?.nama_santri || "Nama Tidak Diketahui";

    // Inisialisasi Group Halaqah
    if (!acc[halaqahName]) {
      acc[halaqahName] = {
        name: halaqahName,
        totalHafalan: 0,
        totalMurajaah: 0,
        santriGroup: {}
      };
    }

    // Inisialisasi Group Santri di dalam Halaqah
    if (!acc[halaqahName].santriGroup[santriId]) {
      acc[halaqahName].santriGroup[santriId] = {
        nama: santriName,
        setoran: [],
        stats: { HAFALAN: 0, MURAJAAH: 0 }
      };
    }

    // Push data setoran
    acc[halaqahName].santriGroup[santriId].setoran.push(item);
    
    // Update Stats Halaqah
    if (item.kategori === "HAFALAN") acc[halaqahName].totalHafalan++;
    else acc[halaqahName].totalMurajaah++;

    // Update Stats per Santri
    const kategori = item.kategori as "HAFALAN" | "MURAJAAH";
    acc[halaqahName].santriGroup[santriId].stats[kategori]++;

    return acc;
  }, {});
};