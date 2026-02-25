import { displayApi } from "@/api/axiosClient";
import type { Santri, SetoranRecord, Halaqah, AbsensiRecord } from "../types";

export const displayService = {
  getSantriList: async (): Promise<Santri[]> => {
    const response = await displayApi.get("/santri");
    return response.data.data; 
  },

  getSetoranAll: async (): Promise<SetoranRecord[]> => {
    const response = await displayApi.get("/setoran/all");
    return response.data.data;
  },

  getHalaqahList: async (): Promise<Halaqah[]> => {
    const response = await displayApi.get("/halaqah");
    return response.data.data;
  },

  getAbsensiByHalaqah: async (halaqahId: string | number, date: string): Promise<AbsensiRecord[]> => {
    // date format: YYYY-MM-DD
    const response = await displayApi.get(`/absensi/halaqah/${halaqahId}?date=${date}`);
    // Pastikan ini mengembalikan array AbsensiRecord
    return response.data.data || [];
  }
};