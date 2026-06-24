import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type SetoranItem } from "@/features/setoran/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SantriGroupItem {
  nama_santri: string;
  setoran: SetoranItem[];
  stats: Record<string, number>;
}

interface HalaqahGroupItem {
  name: string;
  totalHafalan: number;
  totalMurajaah: number;
  santriGroup: Record<number, SantriGroupItem>;
}

type GroupedSetoran = Record<string, HalaqahGroupItem>;

export const groupSetoranByHalaqahAndSantri = (data: SetoranItem[]): GroupedSetoran => {
  return data.reduce((acc: GroupedSetoran, item: SetoranItem) => {
    const halaqahName = item.santri?.halaqah?.name_halaqah || "Tanpa Halaqah";
    const santriId = item.id_santri;
    const santriName = item.santri?.nama_santri || "Nama Tidak Diketahui";

    // 1. Inisialisasi Halaqah jika belum ada
    if (!acc[halaqahName]) {
      acc[halaqahName] = {
        name: halaqahName,
        totalHafalan: 0,
        totalMurajaah: 0,
        santriGroup: {},
      };
    }

    // 2. Inisialisasi Santri di dalam Halaqah tersebut
    if (!acc[halaqahName].santriGroup[santriId]) {
      acc[halaqahName].santriGroup[santriId] = {
        nama_santri: santriName,
        setoran: [],
        stats: { HAFALAN: 0, MURAJAAH: 0, ZIYADAH: 0, INTENS: 0, BACAAN: 0 },
      };
    }

    // 3. Masukkan data setoran
    acc[halaqahName].santriGroup[santriId].setoran.push(item);

    // 4. Update Stats Global Halaqah & Stats Per Santri
    acc[halaqahName][
      item.kategori === "HAFALAN" ? "totalHafalan" : "totalMurajaah"
    ]++;
    acc[halaqahName].santriGroup[santriId].stats[item.kategori] = 
      (acc[halaqahName].santriGroup[santriId].stats[item.kategori] || 0) + 1;

    return acc;
  }, {});
};
