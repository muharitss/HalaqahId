import axiosClient from "@/lib/axiosClient";
import { getErrorMessage } from "@/utils/error";
import { type GlobalResponse } from "@/types/api/global-response";
import { 
  type CreateAbsensiSantriRequest as AbsensiPayload, 
  type AbsensiSantri as AbsensiRecord
} from "@/types/domain/absensi";
import { type MonthlyAbsensiData } from "../../types";

export const absensiService = {
  catatAbsensi: async (payload: AbsensiPayload | AbsensiPayload[]) => {
    try {
      const res = await axiosClient.post<GlobalResponse<AbsensiRecord>>("/absensi", payload);
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
  ): Promise<GlobalResponse<AbsensiRecord[] | MonthlyAbsensiData[]>> => {
    const params = new URLSearchParams();
    if (date) params.append("date", date);
    if (month) params.append("month", month);
    if (year) params.append("year", year);

    try {
      const res = await axiosClient.get<GlobalResponse<AbsensiRecord[] | MonthlyAbsensiData[]>>(
        `/absensi/halaqah/${halaqahId}?${params.toString()}`
      );
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil rekap absensi"));
    }
  },

  getAbsensiSesi: async (
    sesiId: number, 
    date?: string
  ): Promise<GlobalResponse<AbsensiRecord[]>> => {
    const params = new URLSearchParams();
    if (date) params.append("date", date);

    try {
      const res = await axiosClient.get<GlobalResponse<AbsensiRecord[]>>(
        `/absensi/sesi/${sesiId}?${params.toString()}`
      );
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil rekap absensi sesi"));
    }
  },

  getDailyHalaqah: async (halaqahId: number, date: string) => {
    try {
      const res = await axiosClient.get<GlobalResponse<AbsensiRecord[]>>(
        `/absensi/halaqah/${halaqahId}?date=${date}`
      );
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil absensi harian"));
    }
  },

  getAllRekapSantri: async (
    month?: string,
    year?: string,
    startDate?: string,
    endDate?: string
  ): Promise<GlobalResponse<MonthlyAbsensiData[]>> => {
    try {
      const params = new URLSearchParams();
      if (month) params.append("month", month);
      if (year) params.append("year", year);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await axiosClient.get<GlobalResponse<MonthlyAbsensiData[]>>(
        `/absensi/rekap-santri?${params.toString()}`
      );
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil rekap semua santri"));
    }
  },
};
