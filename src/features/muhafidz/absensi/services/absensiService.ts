import axiosClient from "@/api/axiosClient";
import { getErrorMessage } from "@/utils/error";
import { type ApiResponse } from "@/services/halaqahService";
import { type AbsensiStatus, type AbsensiPayload, type AbsensiRecord } from "../types";

export interface MonthlyAbsensiData {
  tanggal: string;
  data: {
    santri_id: number;
    status: AbsensiStatus;
  }[];
}

export const absensiService = {
  catatAbsensi: async (payload: AbsensiPayload) => {
    try {
      const res = await axiosClient.post<ApiResponse<AbsensiRecord>>("/absensi", payload);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mencatat absensi"));
    }
  },

  getRekapHalaqah: async (
    halaqahId: number, 
    date?: string, 
    month?: string, 
    year?: string
  ): Promise<ApiResponse<AbsensiRecord[] | MonthlyAbsensiData[]>> => {
    const params = new URLSearchParams();
    if (date) params.append("date", date);
    if (month) params.append("month", month);
    if (year) params.append("year", year);

    try {
      const res = await axiosClient.get<ApiResponse<AbsensiRecord[] | MonthlyAbsensiData[]>>(
        `/absensi/halaqah/${halaqahId}?${params.toString()}`
      );
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil rekap absensi"));
    }
  },

  getDailyHalaqah: async (halaqahId: number, date: string) => {
    try {
      const res = await axiosClient.get<ApiResponse<AbsensiRecord[]>>(
        `/absensi/halaqah/${halaqahId}?date=${date}`
      );
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil absensi harian"));
    }
  },
};