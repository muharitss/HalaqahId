import axiosClient from "@/lib/axiosClient";
import type { Halaqah } from "@/types/domain/halaqah";
import type { SetoranRecord, AbsensiRecord, SantriDetailData, DisplaySantri } from "../../types";

export const displayService = {
  getSantriList: async (slug: string): Promise<DisplaySantri[]> => {
    const response = await axiosClient.get(`/display/${slug}/santri`);
    return response.data.data; 
  },

  getSetoranAll: async (slug: string): Promise<SetoranRecord[]> => {
    const response = await axiosClient.get(`/display/${slug}/setoran/all`);
    return response.data.data;
  },

  getHalaqahList: async (slug: string): Promise<Halaqah[]> => {
    const response = await axiosClient.get(`/display/${slug}/halaqah`);
    return response.data.data;
  },

  getAbsensiByHalaqah: async (slug: string, halaqahId: string | number, date: string): Promise<AbsensiRecord[]> => {
    // date format: YYYY-MM-DD
    const response = await axiosClient.get(`/display/${slug}/absensi/halaqah/${halaqahId}?date=${date}`);
    // Pastikan ini mengembalikan array AbsensiRecord
    return response.data.data || [];
  },

  getSantriDetail: async (
    slug: string,
    id: number | string,
    month?: number | string,
    year?: number | string,
  ): Promise<SantriDetailData> => {
    const params = new URLSearchParams();
    if (month !== undefined && month !== null && month !== "") params.append("month", String(month));
    if (year !== undefined && year !== null && year !== "") params.append("year", String(year));
    const qs = params.toString() ? `?${params.toString()}` : "";
    const response = await axiosClient.get(`/display/${slug}/santri/${id}${qs}`);
    return response.data.data;
  }
};
