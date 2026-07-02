import axiosClient from "@/lib/axiosClient";
import { getErrorMessage } from "@/utils/error";
import { type Muhafiz } from "../types";
import type { GlobalResponse } from "@/types/api/global-response";

/** Struktur satu item absensi harian muhafiz dari endpoint GET /absensi/muhafiz/harian */
export interface DailyAbsensiMuhafizItem {
  id_absensi: number;
  id_user: number;
  id_sesi: number | null;
  status: string;
  keterangan: string | null;
}

export const muhafizService = {
  // Get all muhafiz
  getAllMuhafiz: async (): Promise<Muhafiz[]> => {
    try {
      const response = await axiosClient.get<GlobalResponse<Muhafiz[]>>("/halaqah/auth/muhafiz");
      
      const resData = response.data;

      // Handle berbagai format response dengan lebih efisien
      if (resData?.data && Array.isArray(resData.data)) {
        return resData.data;
      } 
      
      if (Array.isArray(resData)) {
        return resData;
      }
      
      console.warn("Unexpected response format:", resData);
      return [];
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, "Gagal mengambil data muhafiz");
      console.error("Error getAllMuhafiz:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Get muhafiz by ID
  getMuhafizById: async (userId: number): Promise<Muhafiz> => {
    try {
      const response = await axiosClient.get<GlobalResponse<Muhafiz>>(`/halaqah/auth/muhafiz/${userId}`);
      if (!response.data.data) throw new Error("Data muhafiz tidak ditemukan");
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil detail muhafiz"));
    }
  },

  // Search muhafiz
  searchMuhafiz: async (keyword: string): Promise<Muhafiz[]> => {
    try {
      const response = await axiosClient.get<GlobalResponse<Muhafiz[]>>(
        `/halaqah/auth/muhafiz/search?q=${encodeURIComponent(keyword)}`
      );
      return response.data.data || [];
    } catch (error: unknown) {
      console.error("Error searchMuhafiz, falling back to client-side filter:", error);
      
      try {
        const allData = await muhafizService.getAllMuhafiz();
        return allData.filter(muhafiz =>
          muhafiz.name.toLowerCase().includes(keyword.toLowerCase()) ||
          muhafiz.email.toLowerCase().includes(keyword.toLowerCase())
        );
      } catch {
        // Menghapus 'fallbackError' yang tidak terpakai untuk menghilangkan warning ESLint
        throw new Error(getErrorMessage(error, "Gagal mencari muhafiz"));
      }
    }
  },

  // Create new muhafiz - Register
  createMuhafiz: async (data: { name: string; email: string; password: string }) => {
    try {
      const response = await axiosClient.post<GlobalResponse<{ user: Muhafiz }>>("/halaqah/auth/register", data);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mendaftar muhafiz"));
    }
  },

  updateAbsensiAsatidz: async (id: number, payload: { status: string; keterangan?: string }) => {
    try {
      const res = await axiosClient.patch(`/absensi/muhafiz/${id}`, payload);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memperbarui absensi muhafiz"));
    }
  },

  // Update muhafiz
  updateMuhafiz: async (userId: number, data: { name?: string; email?: string }) => {
    try {
      const response = await axiosClient.patch<GlobalResponse<Muhafiz>>(`/halaqah/auth/muhafiz/${userId}`, data);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memperbarui muhafiz"));
    }
  },

  // Delete muhafiz (soft delete)
  deleteMuhafiz: async (userId: number) => {
    try {
      const response = await axiosClient.delete<GlobalResponse<null>>(`/halaqah/auth/muhafiz/${userId}`);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal menghapus muhafiz"));
    }
  },

  // Impersonate muhafiz
  impersonateMuhafiz: async (userId: number) => {
    try {
      const response = await axiosClient.post<GlobalResponse<{ user: Muhafiz; token: string }>>(
        `/halaqah/auth/impersonate/${userId}`
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal melakukan impersonasi"));
    }
  },

  // Get deleted muhafiz (trash)
  getDeletedMuhafiz: async (): Promise<Muhafiz[]> => {
    try {
      const response = await axiosClient.get<GlobalResponse<Muhafiz[]>>("/halaqah/auth/muhafiz/deleted");
      return response.data.data || [];
    } catch (error: unknown) {
      console.error("Gagal mengambil data tempat sampah:", error);
      return [];
    }
  },

  // Restore muhafiz
  restoreMuhafiz: async (userId: number) => {
    try {
      const response = await axiosClient.patch<GlobalResponse<Muhafiz>>(`/halaqah/auth/muhafiz/restore/${userId}`, {});
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memulihkan muhafiz"));
    }
  },

  // Get active muhafiz IDs
  getActiveMuhafizIds: async (): Promise<Set<number>> => {
    try {
      // Implementasi sesuai kebutuhan di masa depan
      return new Set();
    } catch (error) {
      console.error("Gagal mengecek status aktif muhafiz", error);
      return new Set();
    }
  },

  catatAbsensiAsatidz: async (payload: { id_user: number; id_sesi?: number; status: string; tanggal: string; keterangan: string }) => {
    try {
      const res = await axiosClient.post("/absensi/muhafiz", payload);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mencatat absensi muhafiz"));
    }
  },

  /**
   * Mengambil absensi harian muhafiz untuk tanggal dan sesi tertentu.
   * Filter dilakukan di server untuk efisiensi dan akurasi.
   */
  getDailyAsatidz: async (
    dateString: string,
    id_sesi?: number,
  ): Promise<GlobalResponse<DailyAbsensiMuhafizItem[]>> => {
    try {
      const params = new URLSearchParams({ date: dateString });
      if (id_sesi !== undefined) params.set("id_sesi", String(id_sesi));

      const res = await axiosClient.get<GlobalResponse<DailyAbsensiMuhafizItem[]>>(
        `/absensi/muhafiz/harian?${params}`,
      );
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil data absensi harian muhafiz"));
    }
  },

  getMonthlyAsatidz: async (month: number, year: number) => {
    try {
      const res = await axiosClient.get(`/absensi/rekap-muhafiz?month=${month}&year=${year}`);
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Gagal mengambil rekap bulanan"));
    }
  },
};
