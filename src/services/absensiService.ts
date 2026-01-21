import axiosClient from "@/api/axiosClient";
import { type ApiResponse } from "./halaqahService";

export type AbsensiStatus = "HADIR" | "IZIN" | "SAKIT" | "ALFA" | "TERLAMBAT";

export interface AbsensiPayload {
  santri_id: number;
  status: AbsensiStatus;
  keterangan?: string;
  tanggal?: string; // YYYY-MM-DD
}

export const absensiService = {
  catatAbsensi: async (payload: AbsensiPayload) => {
    const res = await axiosClient.post<ApiResponse<any>>("/absensi", payload);
    return res.data;
  },

  getRekapHalaqah: async (halaqahId: number, date?: string, month?: string, year?: string) => {
    const params = new URLSearchParams();
    if (date) params.append("date", date);
    if (month) params.append("month", month);
    if (year) params.append("year", year);

    const res = await axiosClient.get<ApiResponse<any[]>>(
      `/absensi/halaqah/${halaqahId}?${params.toString()}`
    );
    return res.data;
  },

  getDailyHalaqah: async (halaqahId: number, date: string) => {
    const res = await axiosClient.get<ApiResponse<any[]>>(
      `/absensi/halaqah/${halaqahId}?date=${date}`
    );
    return res.data;
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