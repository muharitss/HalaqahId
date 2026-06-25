import axiosClient from "@/lib/axiosClient";
import { getErrorMessage } from "@/utils/error";
import { type ApiResponse } from "@/features/halaqah/api/halaqahService";
import { type Sekolah, type UpdateSekolahRequest } from "@/types/domain/sekolah";

export const sekolahService = {
  getAll: async (): Promise<ApiResponse<Sekolah[]>> => {
    try {
      // Endpoint ini diasumsikan /sekolah/all berdasarkan mock data info,
      // tetapi bisa juga /sekolah jika backend menggunakan endpoint yang sama 
      // dan membedakan berdasarkan role SUPERADMIN
      const res = await axiosClient.get<ApiResponse<Sekolah[]>>("/sekolah/all");
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil daftar sekolah"));
    }
  },
  
  getProfile: async (): Promise<ApiResponse<Sekolah>> => {
    try {
      const res = await axiosClient.get<ApiResponse<Sekolah>>("/sekolah");
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil profil sekolah"));
    }
  },

  updateProfile: async (data: UpdateSekolahRequest): Promise<ApiResponse<Sekolah>> => {
    try {
      const res = await axiosClient.patch<ApiResponse<Sekolah>>("/sekolah", data);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memperbarui profil sekolah"));
    }
  }
};
