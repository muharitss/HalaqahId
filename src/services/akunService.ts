import axiosClient from "@/api/axiosClient";

export interface Muhafiz {
  id_user: number;
  email: string;
  username: string;
  role: "muhafiz";
  nama?: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface UpdateData {
  username?: string;
  email?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const akunService = {
  // Mendapatkan daftar semua muhafidz
  getAllMuhafiz: async (): Promise<ApiResponse<Muhafiz[]>> => {
    const response = await axiosClient.get<ApiResponse<Muhafiz[]>>("auth/muhafiz");
    return response.data;
  },

  // Mendaftarkan muhafiz baru
  registerMuhafiz: async (data: RegisterData): Promise<ApiResponse<{ user: Muhafiz }>> => {
    const response = await axiosClient.post<ApiResponse<{ user: Muhafiz }>>("/auth/register", data);
    return response.data;
  },

  // Edit data muhafiz
  updateMuhafiz: async (userId: number, data: UpdateData): Promise<ApiResponse<Muhafiz>> => {
    const response = await axiosClient.patch<ApiResponse<Muhafiz>>(`/auth/muhafiz/${userId}`, data);
    return response.data;
  },

  // Hapus akun muhafiz (soft delete)
  deleteMuhafiz: async (userId: number): Promise<ApiResponse<null>> => {
    const response = await axiosClient.delete<ApiResponse<null>>(`/auth/muhafiz/${userId}`);
    return response.data;
  }
};