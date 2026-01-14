import axiosClient from "@/api/axiosClient";

export interface Halaqah {
  id_halaqah: number;
  nama_halaqah: string;
  jenis: "BACAAN" | "HAFALAN" | "KHUSUS";
  muhafidz_id: number;
  muhafidz: {
    id_user: number;
    username: string;
    email: string;
  };
  jumlah_santri?: number;
}

export interface CreateHalaqahData {
  nama_halaqah: string;
  jenis: "BACAAN" | "HAFALAN" | "KHUSUS";
  muhafidz_id: number;
}

export interface UpdateHalaqahData {
  nama_halaqah?: string;
  jenis?: "BACAAN" | "HAFALAN" | "KHUSUS";
  muhafidz_id?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const halaqahService = {
  // Mendapatkan semua halaqah
  getAllHalaqah: async (): Promise<ApiResponse<Halaqah[]>> => {
    const response = await axiosClient.get<ApiResponse<Halaqah[]>>("/halaqah");
    return response.data;
  },

  // Membuat halaqah baru
  createHalaqah: async (data: CreateHalaqahData): Promise<ApiResponse<Halaqah>> => {
    const response = await axiosClient.post<ApiResponse<Halaqah>>("/halaqah", data);
    return response.data;
  },

  // Mengupdate halaqah
  updateHalaqah: async (id: number, data: UpdateHalaqahData): Promise<ApiResponse<Halaqah>> => {
    const response = await axiosClient.patch<ApiResponse<Halaqah>>(`/halaqah/${id}`, data);
    return response.data;
  },

  // Menghapus halaqah
  deleteHalaqah: async (id: number): Promise<ApiResponse<null>> => {
    const response = await axiosClient.delete<ApiResponse<null>>(`/halaqah/${id}`);
    return response.data;
  },

  // Mendapatkan daftar muhafiz yang belum punya halaqah
  getAvailableMuhafiz: async (): Promise<ApiResponse<Array<{ id_user: number; username: string; email: string }>>> => {
    const response = await axiosClient.get<ApiResponse<Array<{ id_user: number; username: string; email: string }>>>("/halaqah/available-muhafiz");
    return response.data;
  }
};