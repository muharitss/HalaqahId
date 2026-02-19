import axiosClient from "@/api/axiosClient";
import { type ApiResponse } from "./halaqahService";
import { getErrorMessage } from "@/utils/error";

export type AbsensiStatus = "HADIR" | "IZIN" | "SAKIT" | "ALFA" | "TERLAMBAT";

export interface AbsensiPayload {
  santri_id: number;
  status: AbsensiStatus;
  keterangan?: string;
  tanggal?: string; // YYYY-MM-DD
}

export interface AbsensiRecord {
  id_absensi: number;
  santri_id: number;
  status: AbsensiStatus;
  keterangan: string | null;
  tanggal: string;
  created_at: string;
  updated_at: string;
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

  getRekapHalaqah: async (halaqahId: number, date?: string, month?: string, year?: string) => {
    const params = new URLSearchParams();
    if (date) params.append("date", date);
    if (month) params.append("month", month);
    if (year) params.append("year", year);

    try {
      const res = await axiosClient.get<ApiResponse<AbsensiRecord[]>>(
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

  getMonthlyRekap: async (halaqahId: number, dates: string[]) => {
    const requests = dates.map(date => 
      absensiService.getDailyHalaqah(halaqahId, date)
        .then(res => ({ date, data: res.data }))
        .catch(() => ({ date, data: [] })) 
    );
    return Promise.all(requests);
  }
};
