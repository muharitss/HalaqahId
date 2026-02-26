import axiosClient from "@/api/axiosClient";
import type { Santri, SetoranRecord, Halaqah, AbsensiRecord } from "../types";

export const displayService = {
  getSantriList: async (): Promise<Santri[]> => {
    const response = await axiosClient.get("/santri");
    return response.data.data; 
  },

  getSetoranAll: async (): Promise<SetoranRecord[]> => {
    const response = await axiosClient.get("/display/setoran/all");
    return response.data.data;
  },

  getHalaqahList: async (): Promise<Halaqah[]> => {
    const response = await axiosClient.get("/display/halaqah");
    return response.data.data;
  },

  getAbsensiByHalaqah: async (halaqahId: string | number, date: string): Promise<AbsensiRecord[]> => {
    // date format: YYYY-MM-DD
    const response = await axiosClient.get(`/display/absensi/halaqah/${halaqahId}?date=${date}`);
    // Pastikan ini mengembalikan array AbsensiRecord
    return response.data.data || [];
  }
};