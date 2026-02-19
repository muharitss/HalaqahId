import axiosClient from "@/api/axiosClient";
import { getErrorMessage } from "@/utils/error";

export interface Halaqah {
  id_halaqah: number;
  name_halaqah: string; 
  muhafiz_id: number;
  deleted_at: string | null;
  user: {
    id_user: number;
    username: string;
    email: string;
  };
  _count: {
    santri: number;
  };
}

export interface CreateHalaqahData {
  name_halaqah: string; 
  muhafiz_id: number;   
}

export interface UpdateHalaqahData {
  name_halaqah?: string;
  muhafiz_id?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const halaqahService = {
  getAllHalaqah: async (): Promise<ApiResponse<Halaqah[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<Halaqah[]>>("/halaqah");
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil data halaqah"));
    }
  },

  // 2. Create Halaqah - POST /api/halaqah
  createHalaqah: async (data: CreateHalaqahData): Promise<ApiResponse<Halaqah>> => {
    try {
      const response = await axiosClient.post<ApiResponse<Halaqah>>("/halaqah", {
        name_halaqah: data.name_halaqah,
        muhafiz_id: data.muhafiz_id
      });
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal membuat halaqah"));
    }
  },

  // 3. Update Halaqah - PATCH /api/halaqah/:id
  updateHalaqah: async (id: number, data: UpdateHalaqahData): Promise<ApiResponse<Halaqah>> => {
    try {
      const response = await axiosClient.patch<ApiResponse<Halaqah>>(`/halaqah/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memperbarui halaqah"));
    }
  },

  // 4. Soft Delete Halaqah - DELETE /api/halaqah/:id
  deleteHalaqah: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const response = await axiosClient.delete<ApiResponse<null>>(`/halaqah/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal menghapus halaqah"));
    }
  },

  // 5. Trash List (Deleted Only) - GET /api/halaqah/deleted
  getDeletedHalaqah: async (): Promise<ApiResponse<Halaqah[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<Halaqah[]>>("/halaqah/deleted");
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil data tempat sampah"));
    }
  },

  // 6. Restore Halaqah - PATCH /api/halaqah/restore/:id
  restoreHalaqah: async (id: number): Promise<ApiResponse<Halaqah>> => {
    try {
      const response = await axiosClient.patch<ApiResponse<Halaqah>>(`/halaqah/restore/${id}`, {});
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memulihkan halaqah"));
    }
  }
};
