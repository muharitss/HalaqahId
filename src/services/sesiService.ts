import axiosClient from "@/api/axiosClient";
import { type ApiResponse } from "@/services/halaqahService";
import { type SesiHalaqah, type CreateSesiHalaqahRequest, type UpdateSesiHalaqahRequest } from "@/types/domain/sesi-halaqah";

export const sesiService = {
  getSesiHalaqah: async (): Promise<ApiResponse<SesiHalaqah[]>> => {
    try {
      const res = await axiosClient.get<ApiResponse<SesiHalaqah[]>>("/sesi-halaqah");
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Gagal mengambil sesi halaqah");
    }
  },

  getSesiById: async (id: number): Promise<ApiResponse<SesiHalaqah>> => {
    try {
      const res = await axiosClient.get<ApiResponse<SesiHalaqah>>(`/sesi-halaqah/${id}`);
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Gagal mengambil detail sesi halaqah");
    }
  },

  createSesi: async (payload: CreateSesiHalaqahRequest): Promise<ApiResponse<SesiHalaqah>> => {
    try {
      const res = await axiosClient.post<ApiResponse<SesiHalaqah>>("/sesi-halaqah", payload);
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Gagal membuat sesi halaqah");
    }
  },

  updateSesi: async (id: number, payload: UpdateSesiHalaqahRequest): Promise<ApiResponse<SesiHalaqah>> => {
    try {
      const res = await axiosClient.patch<ApiResponse<SesiHalaqah>>(`/sesi-halaqah/${id}`, payload);
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Gagal memperbarui sesi halaqah");
    }
  },

  deleteSesi: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const res = await axiosClient.delete<ApiResponse<null>>(`/sesi-halaqah/${id}`);
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Gagal menghapus sesi halaqah");
    }
  },
};
