import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const groupSetoranByHalaqahAndSantri = (data: any[]) => {
  return data.reduce((acc: any, item: any) => {
    const halaqahName = item.santri.halaqah.name_halaqah;
    const santriId = item.santri_id;
    const santriName = item.santri.nama_santri;

    // 1. Inisialisasi Halaqah jika belum ada
    if (!acc[halaqahName]) {
      acc[halaqahName] = {
        name: halaqahName,
        totalHafalan: 0,
        totalMurajaah: 0,
        santriGroup: {} 
      };
    }

    // 2. Inisialisasi Santri di dalam Halaqah tersebut
    if (!acc[halaqahName].santriGroup[santriId]) {
      acc[halaqahName].santriGroup[santriId] = {
        nama_santri: santriName,
        setoran: [],
        stats: { HAFALAN: 0, MURAJAAH: 0, ZIYADAH: 0, INTENS: 0, BACAAN: 0 }
      };
    }

    // 3. Masukkan data setoran
    acc[halaqahName].santriGroup[santriId].setoran.push(item);
    
    // 4. Update Stats Global Halaqah & Stats Per Santri
    acc[halaqahName][item.kategori === "HAFALAN" ? 'totalHafalan' : 'totalMurajaah']++;
    acc[halaqahName].santriGroup[santriId].stats[item.kategori]++;

    return acc;
  }, {});
};