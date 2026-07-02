import axiosClient from "@/lib/axiosClient";
import { getErrorMessage } from "@/utils/error";
import { type ApiResponse } from "@/features/halaqah/api/halaqahService";
import { 
  type CreateAbsensiSantriRequest as AbsensiPayload, 
  type AbsensiSantri as AbsensiRecord,
  type UpdateAbsensiSantriRequest,
  type CreateAbsensiMuhafizRequest,
  type UpdateAbsensiMuhafizRequest
} from "@/types/domain/absensi";
import { type MonthlyAbsensiData } from "../types/absensi.schema";

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

  getAbsensiSesi: async (
    sesiId: number, 
    date?: string
  ): Promise<ApiResponse<AbsensiRecord[]>> => {
    const params = new URLSearchParams();
    if (date) params.append("date", date);

    try {
      const res = await axiosClient.get<ApiResponse<AbsensiRecord[]>>(
        `/absensi/sesi/${sesiId}?${params.toString()}`
      );
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil rekap absensi sesi"));
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

  getAllRekapSantri: async (
    month: string,
    year: string
  ): Promise<ApiResponse<MonthlyAbsensiData[]>> => {
    try {
      const res = await axiosClient.get<ApiResponse<MonthlyAbsensiData[]>>(
        `/absensi/rekap-santri?month=${month}&year=${year}`
      );
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil rekap semua santri"));
    }
  },

  getRiwayatAbsensiSantri: async (idSantri: number, params?: { page?: number; limit?: number }) => {
    try {
      const res = await axiosClient.get(`/absensi/santri/${idSantri}`, {params});
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil riwayat absensi santri"));
    }
  },

  updateAbsensiSantri: async (id: number, data: UpdateAbsensiSantriRequest) => {
    try {
      const res = await axiosClient.patch(`/absensi/${id}`, data);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memperbarui absensi santri"));
    }
  },

  deleteAbsensiSantri: async (id: number) => {
    try {
      const res = await axiosClient.delete(`/absensi/${id}`);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal menghapus absensi santri"));
    }
  },

  catatAbsensiMuhafiz: async (data: CreateAbsensiMuhafizRequest) => {
    try {
      const res = await axiosClient.post("/absensi/muhafiz", data);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mencatat absensi muhafiz"));
    }
  },

  getRekapMuhafiz: async (month: number | string, year: number | string) => {
    try {
      const res = await axiosClient.get(`/absensi/rekap-muhafiz?month=${month}&year=${year}`);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil rekap absensi muhafiz"));
    }
  },

  updateAbsensiMuhafiz: async (id: number, data: UpdateAbsensiMuhafizRequest) => {
    try {
      const res = await axiosClient.patch(`/absensi/muhafiz/${id}`, data);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memperbarui absensi muhafiz"));
    }
  },

  deleteAbsensiMuhafiz: async (id: number) => {
    try {
      const res = await axiosClient.delete(`/absensi/muhafiz/${id}`);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal menghapus absensi muhafiz"));
    }
  },
};
