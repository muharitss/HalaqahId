import axiosClient from "@/api/axiosClient";
import { getErrorMessage } from "@/utils/error";
import { type Muhafiz } from "../types";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const muhafizService = {
  // Get all muhafiz
  getAllMuhafiz: async (): Promise<Muhafiz[]> => {
    try {
      const response = await axiosClient.get<ApiResponse<Muhafiz[]>>("/halaqah/auth/muhafiz");
      
      const resData = response.data;

      // Handle berbagai format response dengan lebih efisien
      if (resData?.data && Array.isArray(resData.data)) {
        return resData.data;
      } 
      
      if (Array.isArray(resData)) {
        return resData;
      }
      
      console.warn("Unexpected response format:", resData);
      return [];
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, "Gagal mengambil data muhafiz");
      console.error("Error getAllMuhafiz:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Get muhafiz by ID
  getMuhafizById: async (userId: number): Promise<Muhafiz> => {
    try {
      const response = await axiosClient.get<ApiResponse<Muhafiz>>(`/halaqah/auth/muhafiz/${userId}`);
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil detail muhafiz"));
    }
  },

  // Search muhafiz
  searchMuhafiz: async (keyword: string): Promise<Muhafiz[]> => {
    try {
      const response = await axiosClient.get<ApiResponse<Muhafiz[]>>(
        `/halaqah/auth/muhafiz/search?q=${encodeURIComponent(keyword)}`
      );
      return response.data.data || [];
    } catch (error: unknown) {
      console.error("Error searchMuhafiz, falling back to client-side filter:", error);
      
      try {
        const allData = await muhafizService.getAllMuhafiz();
        return allData.filter(muhafiz =>
          muhafiz.username.toLowerCase().includes(keyword.toLowerCase()) ||
          muhafiz.email.toLowerCase().includes(keyword.toLowerCase())
        );
      } catch {
        // Menghapus 'fallbackError' yang tidak terpakai untuk menghilangkan warning ESLint
        throw new Error(getErrorMessage(error, "Gagal mencari muhafiz"));
      }
    }
  },

  // Create new muhafiz - Register
  createMuhafiz: async (data: { username: string; email: string; password: string }) => {
    try {
      const response = await axiosClient.post<ApiResponse<{ user: Muhafiz }>>("/halaqah/auth/register", data);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mendaftar muhafiz"));
    }
  },

  // Update muhafiz
  updateMuhafiz: async (userId: number, data: { username?: string; email?: string }) => {
    try {
      const response = await axiosClient.patch<ApiResponse<Muhafiz>>(`/halaqah/auth/muhafiz/${userId}`, data);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memperbarui muhafiz"));
    }
  },

  // Delete muhafiz (soft delete)
  deleteMuhafiz: async (userId: number) => {
    try {
      const response = await axiosClient.delete<ApiResponse<null>>(`/halaqah/auth/muhafiz/${userId}`);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal menghapus muhafiz"));
    }
  },

  // Impersonate muhafiz
  impersonateMuhafiz: async (userId: number) => {
    try {
      const response = await axiosClient.post<ApiResponse<{ user: Muhafiz; token: string }>>(
        `/halaqah/auth/impersonate/${userId}`
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal melakukan impersonasi"));
    }
  },

  // Get deleted muhafiz (trash)
  getDeletedMuhafiz: async (): Promise<Muhafiz[]> => {
    try {
      const response = await axiosClient.get<ApiResponse<Muhafiz[]>>("/halaqah/auth/muhafiz/deleted");
      return response.data.data || [];
    } catch (error: unknown) {
      console.error("Gagal mengambil data tempat sampah:", error);
      return [];
    }
  },

  // Restore muhafiz
  restoreMuhafiz: async (userId: number) => {
    try {
      const response = await axiosClient.patch<ApiResponse<Muhafiz>>(`/halaqah/auth/muhafiz/restore/${userId}`, {});
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memulihkan muhafiz"));
    }
  },

  // Get active muhafiz IDs
  getActiveMuhafizIds: async (): Promise<Set<number>> => {
    try {
      // Implementasi sesuai kebutuhan di masa depan
      return new Set();
    } catch (error) {
      console.error("Gagal mengecek status aktif muhafiz", error);
      return new Set();
    }
  }
};