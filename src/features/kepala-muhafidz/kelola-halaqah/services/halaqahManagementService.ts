import axiosClient from "@/api/axiosClient";
import { santriService } from "@/features/muhafidz/kelola-santri/services/santriService";
import { type Halaqah, type HalaqahResponse } from "../types";
import { type Santri } from "@/features/muhafidz/kelola-santri/types";

export type { Halaqah };

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const halaqahManagementService = {
  // Get all halaqah
  getAllHalaqah: async (): Promise<Halaqah[]> => {
    const response = await axiosClient.get<HalaqahResponse>("/halaqah");
    return response.data.data; 
  },

  // Get all santri
  getAllSantri: async (): Promise<Santri[]> => {
    try {
      return await santriService.getAll();
    } catch (error) {
      console.error("Gagal mengambil data santri:", error);
      return [];
    }
  },

  // Create halaqah
  createHalaqah: async (data: { name_halaqah: string; muhafiz_id: number }): Promise<ApiResponse<Halaqah>> => {
    const res = await axiosClient.post<ApiResponse<Halaqah>>("/halaqah", data);
    return res.data;
  },

  // Update halaqah
  updateHalaqah: async (id: number, data: { name_halaqah?: string; muhafiz_id?: number }): Promise<ApiResponse<Halaqah>> => {
    const res = await axiosClient.patch<ApiResponse<Halaqah>>(`/halaqah/${id}`, data);
    return res.data;
  },

  // Delete halaqah
  deleteHalaqah: async (id: number): Promise<ApiResponse<void>> => {
    const res = await axiosClient.delete<ApiResponse<void>>(`/halaqah/${id}`);
    return res.data;
  },

  // Get deleted halaqah (trash)
  getDeletedHalaqah: async (): Promise<ApiResponse<Halaqah[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<Halaqah[]>>("/halaqah/trash");
      return response.data;
    } catch (error) {
      console.error("Gagal mengambil halaqah terhapus:", error);
      throw error;
    }
  },

  // Restore halaqah
  restoreHalaqah: async (id: number): Promise<ApiResponse<null>> => {
    const res = await axiosClient.post<ApiResponse<null>>(`/halaqah/${id}/restore`);
    return res.data;
  },

  // Create santri
  createSantri: async (data: Santri) => {
    return await santriService.create(data);
  },

  // Update santri
  updateSantri: async (id: number, data: Santri) => {
    return await santriService.update(id, data);
  },

  // Delete santri
  deleteSantri: async (id: number) => {
    return await santriService.delete(id);
  }
};