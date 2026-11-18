import axiosClient from "@/lib/axiosClient";
import type { Halaqah } from "@/types/domain/halaqah";
import type { SetoranRecord, AbsensiRecord, SantriDetailData, DisplaySantri } from "../../types";

export const displayService = {
  getSantriList: async (slug: string, token?: string): Promise<DisplaySantri[]> => {
    const config = token ? { headers: { "x-display-token": token } } : undefined;
    const response = await axiosClient.get(`/display/${slug}/santri`, config);
    return response.data.data; 
  },

  getSetoranAll: async (slug: string, token?: string): Promise<SetoranRecord[]> => {
    const config = token ? { headers: { "x-display-token": token } } : undefined;
    const response = await axiosClient.get(`/display/${slug}/setoran/all`, config);
    return response.data.data;
  },

  getHalaqahList: async (slug: string, token?: string): Promise<Halaqah[]> => {
    const config = token ? { headers: { "x-display-token": token } } : undefined;
    const response = await axiosClient.get(`/display/${slug}/halaqah`, config);
    return response.data.data;
  },

  getAbsensiByHalaqah: async (slug: string, halaqahId: string | number, date: string, token?: string): Promise<AbsensiRecord[]> => {
    // date format: YYYY-MM-DD
    const config = token ? { headers: { "x-display-token": token } } : undefined;
    const response = await axiosClient.get(`/display/${slug}/absensi/halaqah/${halaqahId}?date=${date}`, config);
    // Pastikan ini mengembalikan array AbsensiRecord
    return response.data.data || [];
  },

  getSantriDetail: async (slug: string, id: number | string, token?: string): Promise<SantriDetailData> => {
    const config = token ? { headers: { "x-display-token": token } } : undefined;
    const response = await axiosClient.get(`/display/${slug}/santri/${id}`, config);
    return response.data.data;
  }
};
