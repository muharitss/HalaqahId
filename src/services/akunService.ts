import axiosClient from "@/api/axiosClient";

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

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export const akunService = {
  getAllMuhafiz: async (): Promise<ApiResponse<Muhafiz[]>> => {
    const response = await axiosClient.get<ApiResponse<Muhafiz[]>>("/auth/muhafiz");
    return response.data;
  },

  getMuhafizById: async (userId: number): Promise<ApiResponse<Muhafiz>> => {
    try {
      const response = await axiosClient.get<ApiResponse<Muhafiz>>(`/auth/muhafiz/${userId}`);
      return response.data;
    } catch (error: any) {
      // Jika endpoint tidak tersedia, bisa fallback ke getAll dan filter
      if (error.response?.status === 404) {
        throw new Error("Endpoint detail muhafiz tidak tersedia");
      }
      throw error;
    }
  },

  searchMuhafiz: async (keyword: string): Promise<ApiResponse<Muhafiz[]>> => {
    try {
      // Jika backend punya endpoint search
      const response = await axiosClient.get<ApiResponse<Muhafiz[]>>(
        `/auth/muhafiz/search?q=${encodeURIComponent(keyword)}`
      );
      return response.data;
    } catch (error: any) {
      // Fallback: ambil semua data dan filter di client-side
      if (error.response?.status === 404) {
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
      throw error;
    }
  },

  registerMuhafiz: async (data: RegisterData): Promise<ApiResponse<{ user: Muhafiz }>> => {
    const response = await axiosClient.post<ApiResponse<{ user: Muhafiz }>>("/auth/register", data);
    return response.data;
  },

  updateMuhafiz: async (userId: number, data: UpdateMuhafizData): Promise<ApiResponse<Muhafiz>> => {
    const response = await axiosClient.patch<ApiResponse<Muhafiz>>(`/auth/muhafiz/${userId}`, data);
    return response.data;
  },

    impersonateMuhafiz: async (userId: number): Promise<ApiResponse<{ user: Muhafiz; token: string }>> => {
      const response = await axiosClient.post<ApiResponse<{ user: Muhafiz; token: string }>>(
        `/auth/impersonate/${userId}`
      );
      return response.data;
    },

  // Hapus akun muhafiz (soft delete)
  deleteMuhafiz: async (userId: number): Promise<ApiResponse<null>> => {
    const response = await axiosClient.delete<ApiResponse<null>>(`/auth/muhafiz/${userId}`);
    return response.data;
  },

  bulkDeleteMuhafiz: async (userIds: number[]): Promise<ApiResponse<null>> => {
    try {
      const response = await axiosClient.post<ApiResponse<null>>("/auth/muhafiz/bulk-delete", {
        user_ids: userIds
      });
      return response.data;
    } catch (error: any) {
      // Jika endpoint tidak tersedia, hapus satu per satu
      if (error.response?.status === 404) {
        console.warn("Endpoint bulk delete tidak tersedia, melakukan delete satu per satu");
        
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
      throw error;
    }
  },

  getDeletedMuhafiz: async (): Promise<ApiResponse<Muhafiz[]>> => {
    const response = await axiosClient.get<ApiResponse<Muhafiz[]>>("/auth/muhafiz/deleted");
    return response.data;
  },

  restoreMuhafiz: async (userId: number): Promise<ApiResponse<Muhafiz>> => {
    const response = await axiosClient.patch<ApiResponse<Muhafiz>>(`/auth/muhafiz/restore/${userId}`, {});
    return response.data;
  },
};

export interface UpdateData {
  username?: string;
  email?: string;
}