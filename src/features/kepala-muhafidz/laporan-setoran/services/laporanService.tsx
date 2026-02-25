import { setoranService } from "@/features/muhafidz/setoran/services/setoranService";
import { halaqahService } from "@/services/halaqahService";
import { transformSetoranData } from "@/lib/dataTransformer";
import type { DateFilter, GroupedData, SetoranItem } from "../types";
import { santriService } from "@/features/muhafidz/kelola-santri/services/santriService";

export const laporanService = {
  // Get all setoran data
  getAllSetoran: async (): Promise<SetoranItem[]> => {
    try {
      const res = await setoranService.getAllSetoran();
      return res.data || [];
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
  transformSetoranData: (data: SetoranItem[], filter?: DateFilter): GroupedData => {
    return transformSetoranData(data, filter);
  },

  // Get halaqah names from grouped data
  getHalaqahNames: (groupedData: GroupedData): string[] => {
    return Object.keys(groupedData);
  },

  // Get halaqah ID by name
  getHalaqahIdByName: (halaqahList: any[], halaqahName: string): number | undefined => {
    return halaqahList.find(h => h.name_halaqah === halaqahName)?.id_halaqah;
  },

  // Filter santri by halaqah ID
  getSantriByHalaqahId: (santriList: any[], halaqahId: number) => {
    return santriList.filter(s => s.halaqah_id === halaqahId);
  }
};