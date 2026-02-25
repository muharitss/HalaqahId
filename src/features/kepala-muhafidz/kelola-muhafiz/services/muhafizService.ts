import axiosClient from "@/api/axiosClient";
import { halaqahManagementService as halaqahService } from "@/features/kepala-muhafidz/kelola-halaqah/services/halaqahManagementService";
import { type Muhafiz } from "../types";
import { type ApiResponse } from "@/features/kepala-muhafidz/kelola-halaqah/services/halaqahManagementService";

export type { Muhafiz };

export const muhafizService = {
  // Get all muhafiz
  getAllMuhafiz: async (): Promise<Muhafiz[]> => {
    try {
      const response = await axiosClient.get<ApiResponse<Muhafiz[]>>("/muhafiz");
      return response.data.data || [];
    } catch (error) {
      console.error("Gagal mengambil data muhafiz:", error);
      return [];
    }
  },

  // Get active muhafiz IDs (those assigned to halaqah)
  getActiveMuhafizIds: async (): Promise<Set<number>> => {
    try {
      const res = await halaqahService.getAllHalaqah();
      return new Set(res.map(h => h.muhafiz_id));
    } catch (error) {
      console.error("Gagal mengecek status aktif muhafiz", error);
      return new Set();
    }
  },

  // Create new muhafiz
  createMuhafiz: async (data: { username: string; email: string; password: string }): Promise<ApiResponse<any>> => {
    const res = await axiosClient.post<ApiResponse<any>>("/muhafiz", data);
    return res.data;
  },

  // Update muhafiz
  updateMuhafiz: async (userId: number, data: { username?: string; email?: string }): Promise<ApiResponse<any>> => {
    const res = await axiosClient.put<ApiResponse<any>>(`/muhafiz/${userId}`, data);
    return res.data;
  },

  // Delete muhafiz
  deleteMuhafiz: async (userId: number): Promise<ApiResponse<any>> => {
    const res = await axiosClient.delete<ApiResponse<any>>(`/muhafiz/${userId}`);
    return res.data;
  },

  // Get deleted muhafiz (trash)
  getDeletedMuhafiz: async (): Promise<ApiResponse<Muhafiz[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<Muhafiz[]>>("/muhafiz/trash");
      return response.data;
    } catch (error) {
      console.error("Gagal mengambil muhafiz terhapus:", error);
      throw error;
    }
  },

  // Restore muhafiz
  restoreMuhafiz: async (userId: number): Promise<ApiResponse<any>> => {
    const res = await axiosClient.post<ApiResponse<any>>(`/muhafiz/${userId}/restore`);
    return res.data;
  },

  // Impersonate muhafiz
  impersonateMuhafiz: async (userId: number): Promise<ApiResponse<any>> => {
    const res = await axiosClient.post<ApiResponse<any>>(`/muhafiz/${userId}/impersonate`);
    return res.data;
  }
};