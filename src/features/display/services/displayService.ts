import axiosClient from "@/api/axiosClient";
import type { Santri } from "@/types/domain/santri";
import type { Halaqah } from "@/types/domain/halaqah";
import type { SetoranRecord, AbsensiRecord, SantriDetailData } from "@/types/domain/display";

export const displayService = {
  getSantriList: async (token: string): Promise<Santri[]> => {
    const response = await axiosClient.get(`/display/${token}/santri`);
    return response.data.data; 
  },

  getSetoranAll: async (token: string): Promise<SetoranRecord[]> => {
    const response = await axiosClient.get(`/display/${token}/setoran/all`);
    return response.data.data;
  },

  getHalaqahList: async (token: string): Promise<Halaqah[]> => {
    const response = await axiosClient.get(`/display/${token}/halaqah`);
    return response.data.data;
  },

  getAbsensiByHalaqah: async (token: string, halaqahId: string | number, date: string): Promise<AbsensiRecord[]> => {
    // date format: YYYY-MM-DD
    const response = await axiosClient.get(`/display/${token}/absensi/halaqah/${halaqahId}?date=${date}`);
    // Pastikan ini mengembalikan array AbsensiRecord
    return response.data.data || [];
  },

  getSantriDetail: async (token: string, id: number | string): Promise<SantriDetailData> => {
    const response = await axiosClient.get(`/display/${token}/santri/${id}`);
    return response.data.data;
  }
};