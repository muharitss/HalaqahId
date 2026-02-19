import axiosClient from "@/api/axiosClient";
import { getErrorMessage } from "@/utils/error";

export interface Muhafiz {
  id_user: number;
  email: string;
  username: string;
  role: "muhafiz";
  nama?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string; 
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface UpdateMuhafizData {
  username?: string;
  email?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const akunService = {
  getAllMuhafiz: async (): Promise<ApiResponse<Muhafiz[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<Muhafiz[]>>("/halaqah/auth/muhafiz");
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil data muhafiz"));
    }
  },

  getMuhafizById: async (userId: number): Promise<ApiResponse<Muhafiz>> => {
    try {
      const response = await axiosClient.get<ApiResponse<Muhafiz>>(`/halaqah/auth/muhafiz/${userId}`);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil detail muhafiz"));
    }
  },

  searchMuhafiz: async (keyword: string): Promise<ApiResponse<Muhafiz[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<Muhafiz[]>>(
        `/halaqah/auth/muhafiz/search?q=${encodeURIComponent(keyword)}`
      );
      return response.data;
    } catch (error: unknown) {
      // Fallback: ambil semua data dan filter di client-side if 404
      const err = error as { response?: { status: number } };
      if (err.response?.status === 404) {
        const allResponse = await akunService.getAllMuhafiz();
        const filteredData = allResponse.data.filter(muhafiz =>
          muhafiz.username.toLowerCase().includes(keyword.toLowerCase()) ||
          muhafiz.email.toLowerCase().includes(keyword.toLowerCase()) ||
          (muhafiz.nama && muhafiz.nama.toLowerCase().includes(keyword.toLowerCase()))
        );
        return {
          success: true,
          message: `Menemukan ${filteredData.length} hasil untuk "${keyword}"`,
          data: filteredData
        };
      }
      throw new Error(getErrorMessage(error, "Gagal mencari muhafiz"));
    }
  },

  registerMuhafiz: async (data: RegisterData): Promise<ApiResponse<{ user: Muhafiz }>> => {
    try {
      const response = await axiosClient.post<ApiResponse<{ user: Muhafiz }>>("/halaqah/auth/register", data);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mendaftar muhafiz"));
    }
  },

  updateMuhafiz: async (userId: number, data: UpdateMuhafizData): Promise<ApiResponse<Muhafiz>> => {
    try {
      const response = await axiosClient.patch<ApiResponse<Muhafiz>>(`/halaqah/auth/muhafiz/${userId}`, data);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memperbarui muhafiz"));
    }
  },

  impersonateMuhafiz: async (userId: number): Promise<ApiResponse<{ user: Muhafiz; token: string }>> => {
    try {
      const response = await axiosClient.post<ApiResponse<{ user: Muhafiz; token: string }>>(
        `/halaqah/auth/impersonate/${userId}`
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal melakukan impersonasi"));
    }
  },

  // Hapus akun muhafiz (soft delete)
  deleteMuhafiz: async (userId: number): Promise<ApiResponse<null>> => {
    try {
      const response = await axiosClient.delete<ApiResponse<null>>(`/halaqah/auth/muhafiz/${userId}`);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal menghapus muhafiz"));
    }
  },

  bulkDeleteMuhafiz: async (userIds: number[]): Promise<ApiResponse<null>> => {
    try {
      const response = await axiosClient.post<ApiResponse<null>>("/halaqah/auth/muhafiz/bulk-delete", {
        user_ids: userIds
      });
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { status: number } };
      if (err.response?.status === 404) {
        // console.warn("Endpoint bulk delete tidak tersedia, melakukan delete satu per satu"); // Removed as per instruction
        
        const results = await Promise.allSettled(
          userIds.map(id => akunService.deleteMuhafiz(id))
        );
        
        const successes = results.filter(r => r.status === 'fulfilled').length;
        const failures = results.filter(r => r.status === 'rejected').length;
        
        if (failures === 0) {
          return {
            success: true,
            message: `Berhasil menghapus ${successes} akun muhafiz`,
            data: null
          };
        } else {
          throw new Error(`Gagal menghapus ${failures} dari ${userIds.length} akun`);
        }
      }
      throw new Error(getErrorMessage(error, "Gagal menghapus muhafiz secara massal"));
    }
  },

  getDeletedMuhafiz: async (): Promise<ApiResponse<Muhafiz[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<Muhafiz[]>>("/halaqah/auth/muhafiz/deleted");
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil data tempat sampah"));
    }
  },

  restoreMuhafiz: async (userId: number): Promise<ApiResponse<Muhafiz>> => {
    try {
      const response = await axiosClient.patch<ApiResponse<Muhafiz>>(`/halaqah/auth/muhafiz/restore/${userId}`, {});
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memulihkan muhafiz"));
    }
  },
};

export interface UpdateData {
  username?: string;
  email?: string;
}