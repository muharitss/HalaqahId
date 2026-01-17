import { isSameMonth, parseISO } from "date-fns";

export const transformSetoranData = (data: any[], selectedDate: Date) => {
  return data.reduce((acc: any, item: any) => {
    const itemDate = parseISO(item.tanggal_setoran);
    
    if (!isSameMonth(itemDate, selectedDate)) return acc;

    const halaqahName = item.santri.halaqah.name_halaqah || "Tanpa Halaqah";
    const santriId = item.santri_id;
    const santriName = item.santri.nama_santri;

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
    acc[halaqahName][item.kategori === "HAFALAN" ? "totalHafalan" : "totalMurajaah"]++;
    acc[halaqahName].santriGroup[santriId].stats[item.kategori]++;

    return acc;
  }, {});
};