import { setoranService } from "@/features/setoran/api/setoranService";
import { halaqahService } from "@/features/halaqah/api/halaqahService";
import { transformSetoranData } from "@/lib/dataTransformer";
import type { DateFilter, GroupedData, SetoranItem } from "../types";
import { santriService } from "@/features/santri/api/santriService";
import { absensiService } from "@/features/shared/api";

export const laporanService = {
  // Get all setoran data
  getAllSetoran: async (): Promise<SetoranItem[]> => {
    try {
      const res = await setoranService.getAllSetoran();
      return (res.data as unknown as SetoranItem[]) || [];
    } catch (error) {
      console.error("Gagal mengambil data setoran:", error);
      return [];
    }
  },

  // Get all halaqah
  getAllHalaqah: async () => {
    try {
      const res = await halaqahService.getAllHalaqah();
      return res || [];
    } catch (error) {
      console.error("Gagal mengambil data halaqah:", error);
      return [];
    }
  },

  // Get all santri
  getAllSantri: async () => {
    try {
      return await santriService.getAll();
    } catch (error) {
      console.error("Gagal mengambil data santri:", error);
      return [];
    }
  },

  // Transform data with filter
  transformSetoranData: (
    data: SetoranItem[],
    filter?: DateFilter,
  ): GroupedData => {
    return transformSetoranData(data, filter) as unknown as GroupedData;
  },

  // Get halaqah names from grouped data
  getHalaqahNames: (groupedData: GroupedData): string[] => {
    return Object.keys(groupedData);
  },

  // Get halaqah ID by name
  getHalaqahIdByName: (
    halaqahList: any[],
    halaqahName: string,
  ): number | undefined => {
    return halaqahList.find((h) => h.name_halaqah === halaqahName)?.id_halaqah;
  },

  // Filter santri by halaqah ID
  getSantriByHalaqahId: (santriList: any[], halaqahId: number) => {
    return santriList.filter((s) => s.id_halaqah === halaqahId);
  },

  getAllSantriAbsensiMonthly: async (month: string, year: string) => {
    try {
      // Sesuaikan path ini dengan route yang kamu daftarkan di backend
      const res = await absensiService.getAllRekapSantri(month, year);
      return res.data || [];
    } catch (error) {
      console.error("Gagal mengambil semua rekap absensi:", error);
      return [];
    }
  },

  // Hitung summary stats dari grouped data (client-side)
  getSummaryStats: (
    groupedData: GroupedData,
    activeHalaqah: string,
    periodLabel: string,
  ) => {
    let totalSetoran = 0;
    const santriSet = new Set<string>();
    const distribusiKategori: Record<string, number> = {};
    const distribusiHalaqah: Record<string, number> = {};
    let totalTaqwim = 0;

    Object.entries(groupedData).forEach(([halaqahName, group]: [string, any]) => {
      if (activeHalaqah !== "all" && activeHalaqah !== "" && halaqahName !== activeHalaqah) return;

      let halaqahCount = 0;
      Object.values(group.santriGroup).forEach((santri: any) => {
        santri.setoran.forEach((s: any) => {
          totalSetoran++;
          halaqahCount++;
          santriSet.add(santri.nama);
          totalTaqwim += s.taqwim ?? 0;
          distribusiKategori[s.kategori] = (distribusiKategori[s.kategori] ?? 0) + 1;
        });
      });
      if (halaqahCount > 0) {
        distribusiHalaqah[halaqahName] = halaqahCount;
      }
    });

    const rataRataTaqwim = totalSetoran > 0 ? totalTaqwim / totalSetoran : 0;
    const kategoriDominan = Object.entries(distribusiKategori).sort(
      ([, a], [, b]) => b - a,
    )[0]?.[0] ?? "";

    return {
      totalSetoran,
      totalSantriAktif: santriSet.size,
      rataRataTaqwim,
      kategoriDominan,
      distribusiKategori,
      distribusiHalaqah,
      periodLabel,
    };
  },
};
