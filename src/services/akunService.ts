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

  // Reset password (jika nanti ada endpoint-nya)
  resetPassword: async (_userId: number, _newPassword: string): Promise<ApiResponse<null>> => {
    // Endpoint belum tersedia di dokumentasi
    throw new Error("Endpoint reset password belum tersedia");
  },

  // Hapus akun (jika nanti ada endpoint-nya)
  deleteMuhafiz: async (_userId: number): Promise<ApiResponse<null>> => {
    // Endpoint belum tersedia di dokumentasi
    throw new Error("Endpoint delete belum tersedia");
  }
};