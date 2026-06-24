import axiosClient from "@/lib/axiosClient";
import { santriService } from "@/features/santri/api/santriService";
import { type Halaqah, type HalaqahResponse } from "../types";
import { type Santri } from "../types";
import type { GlobalResponse } from "@/types/api/global-response";

export const halaqahManagementService = {
  // Get all halaqah
  getAllHalaqah: async (): Promise<Halaqah[]> => {
    const response = await axiosClient.get<HalaqahResponse>("/halaqah");
    return response.data.data; 
  },

  // Get all santri
  getAllSantri: async (): Promise<Santri[]> => {
    try {
      return (await santriService.getAll()) as unknown as Santri[];
    } catch (error) {
      console.error("Gagal mengambil data santri:", error);
      return [];
    }
  },

  createHalaqah: async (data: { name_halaqah: string; id_muhafiz: number }): Promise<GlobalResponse<Halaqah>> => {
    const res = await axiosClient.post<GlobalResponse<Halaqah>>("/halaqah", data);
    return res.data;
  },

  // Update halaqah
  updateHalaqah: async (id: number, data: { name_halaqah?: string; id_muhafiz?: number }): Promise<GlobalResponse<Halaqah>> => {
    const res = await axiosClient.patch<GlobalResponse<Halaqah>>(`/halaqah/${id}`, data);
    return res.data;
  },

  // Delete halaqah
  deleteHalaqah: async (id: number): Promise<GlobalResponse<void>> => {
    const res = await axiosClient.delete<GlobalResponse<void>>(`/halaqah/${id}`);
    return res.data;
  },

  // Get deleted halaqah (trash)
  getDeletedHalaqah: async (): Promise<GlobalResponse<Halaqah[]>> => {
    try {
      const response = await axiosClient.get<GlobalResponse<Halaqah[]>>("/halaqah/deleted");
      return response.data;
    } catch (error) {
      console.error("Gagal mengambil halaqah terhapus:", error);
      throw error;
    }
  },

  // Restore halaqah
  restoreHalaqah: async (id: number): Promise<GlobalResponse<null>> => {
    const res = await axiosClient.patch<GlobalResponse<null>>(`/halaqah/restore/${id}`);
    return res.data;
  },

  // Create santri
  createSantri: async (data: Santri) => {
    return await santriService.create(data as any);
  },

  // Update santri
  updateSantri: async (id: number, data: Santri) => {
    return await santriService.update(id, data as any);
  },

  // Delete santri
  deleteSantri: async (id: number) => {
    return await santriService.delete(id);
  }
};
