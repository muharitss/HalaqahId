import axiosClient from "@/api/axiosClient";

export interface Halaqah {
  id_halaqah: number;
  name_halaqah: string; 
  muhafiz_id: number;
  deleted_at: string | null;
  muhafiz: {
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
    const response = await axiosClient.get<ApiResponse<Halaqah[]>>("/halaqah");
    return response.data;
  },

  // 2. Create Halaqah - POST /api/halaqah
  createHalaqah: async (data: CreateHalaqahData): Promise<ApiResponse<Halaqah>> => {
    // Body yang benar sesuai dokumentasi: {"name_halaqah": "Nama Kelompok", "muhafiz_id": 5}
    const response = await axiosClient.post<ApiResponse<Halaqah>>("/halaqah", {
      name_halaqah: data.name_halaqah,
      muhafiz_id: data.muhafiz_id
    });
    return response.data;
  },

  // 3. Update Halaqah - PATCH /api/halaqah/:id (diasumsikan sama endpoint)
  updateHalaqah: async (id: number, data: UpdateHalaqahData): Promise<ApiResponse<Halaqah>> => {
    const response = await axiosClient.patch<ApiResponse<Halaqah>>(`/halaqah/${id}`, data);
    return response.data;
  },

  // 4. Soft Delete Halaqah - DELETE /api/halaqah/:id
  deleteHalaqah: async (id: number): Promise<ApiResponse<null>> => {
    const response = await axiosClient.delete<ApiResponse<null>>(`/halaqah/${id}`);
    return response.data;
  },

  // 5. Trash List (Deleted Only) - GET /api/halaqah/deleted
  getDeletedHalaqah: async (): Promise<ApiResponse<Halaqah[]>> => {
    const response = await axiosClient.get<ApiResponse<Halaqah[]>>("/halaqah/deleted");
    return response.data;
  },

  // 6. Restore Halaqah - PATCH /api/halaqah/restore/:id
  restoreHalaqah: async (id: number): Promise<ApiResponse<Halaqah>> => {
    const response = await axiosClient.patch<ApiResponse<Halaqah>>(`/halaqah/restore/${id}`, {});
    return response.data;
  }
};