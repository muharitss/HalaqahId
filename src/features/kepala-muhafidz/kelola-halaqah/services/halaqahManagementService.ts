import axiosClient from "@/api/axiosClient";
import { santriService } from "@/features/muhafidz/kelola-santri/services/santriService";
import { type Halaqah } from "../types";
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
    try {
      const response = await axiosClient.get<ApiResponse<Halaqah[]>>("/halaqah");
      return response.data.data || [];
    } catch (error) {
      console.error("Gagal mengambil data halaqah:", error);
      throw error;
    }
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
  createHalaqah: async (data: { name_halaqah: string; muhafiz_id: number }): Promise<ApiResponse<any>> => {
    const res = await axiosClient.post<ApiResponse<any>>("/halaqah", data);
    return res.data;
  },

  // Update halaqah
  updateHalaqah: async (id: number, data: { name_halaqah?: string; muhafiz_id?: number }): Promise<ApiResponse<any>> => {
    const res = await axiosClient.put<ApiResponse<any>>(`/halaqah/${id}`, data);
    return res.data;
  },

  // Delete halaqah
  deleteHalaqah: async (id: number): Promise<ApiResponse<any>> => {
    const res = await axiosClient.delete<ApiResponse<any>>(`/halaqah/${id}`);
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
  restoreHalaqah: async (id: number): Promise<ApiResponse<any>> => {
    const res = await axiosClient.post<ApiResponse<any>>(`/halaqah/${id}/restore`);
    return res.data;
  },

  // Create santri
  createSantri: async (data: any) => {
    return await santriService.create(data);
  },

  // Update santri
  updateSantri: async (id: number, data: any) => {
    return await santriService.update(id, data);
  },

  // Delete santri
  deleteSantri: async (id: number) => {
    return await santriService.delete(id);
  }
};