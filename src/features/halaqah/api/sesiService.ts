import axiosClient from "@/lib/axiosClient";
import { type ApiResponse } from "@/features/halaqah/api/halaqahService";
import { type SesiHalaqah, type CreateSesiHalaqahRequest, type UpdateSesiHalaqahRequest } from "@/types/domain/sesi-halaqah";
import { getErrorMessage } from "@/utils/error";

export const sesiService = {
  getSesiHalaqah: async (): Promise<ApiResponse<SesiHalaqah[]>> => {
    try {
      const res = await axiosClient.get<ApiResponse<SesiHalaqah[]>>("/sesi-halaqah");
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil sesi halaqah"));
    }
  },

  getSesiById: async (id: number): Promise<ApiResponse<SesiHalaqah>> => {
    try {
      const res = await axiosClient.get<ApiResponse<SesiHalaqah>>(`/sesi-halaqah/${id}`);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil detail sesi halaqah"));
    }
  },

  createSesi: async (payload: CreateSesiHalaqahRequest): Promise<ApiResponse<SesiHalaqah>> => {
    try {
      const res = await axiosClient.post<ApiResponse<SesiHalaqah>>("/sesi-halaqah", payload);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal membuat sesi halaqah"));
    }
  },

  updateSesi: async (id: number, payload: UpdateSesiHalaqahRequest): Promise<ApiResponse<SesiHalaqah>> => {
    try {
      const res = await axiosClient.patch<ApiResponse<SesiHalaqah>>(`/sesi-halaqah/${id}`, payload);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memperbarui sesi halaqah"));
    }
  },

  deleteSesi: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const res = await axiosClient.delete<ApiResponse<null>>(`/sesi-halaqah/${id}`);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal menghapus sesi halaqah"));
    }
  },
};
