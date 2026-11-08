import axiosClient from "@/lib/axiosClient";
import { getErrorMessage } from "@/utils/error";
import { type ApiResponse } from "@/features/halaqah/api/halaqahService";
import { type GlobalResponseWithPagination } from "@/types/api/global-response";
import {
  type SetoranPayload,
  type SetoranRecord,
  type LaporanHafalanData,
} from "../../types";
import { type Santri } from "@/features/santri/types";
import { santriService } from "@/features/santri/api/services/santriService";

export interface SetoranCheckParams {
  id_santri: number;
  tanggal: string; // format: YYYY-MM-DD
  id_sesi: number;
}

export interface SetoranCheckResult {
  exists: boolean;
  setoran: SetoranRecord | null;
}

export interface LeaderboardParams {
  period?: string;
  startDate?: string;
  endDate?: string;
  id_halaqah?: number;
  mode?: string;
}

export interface LeaderboardRecord {
  rank: number;
  id_santri: number;
  nama_santri: string;
  id_halaqah: number;
  nama_halaqah: string;
  nama_muhafiz: string;
  total_setoran_count: number;
  total_baris: number;
  total_halaman: number;
}

export const setoranService = {
  // GET /setoran/check
  checkSetoran: async (
    params: SetoranCheckParams,
    signal?: AbortSignal,
  ): Promise<ApiResponse<SetoranCheckResult>> => {
    const response = await axiosClient.get<ApiResponse<SetoranCheckResult>>(
      "/setoran/check",
      { params, signal },
    );
    return response.data;
  },

  // GET /setoran/leaderboard
  getLeaderboard: async (
    params: LeaderboardParams,
  ): Promise<ApiResponse<LeaderboardRecord[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<LeaderboardRecord[]>>(
        "/setoran/leaderboard",
        { params },
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil data leaderboard"));
    }
  },

  // POST /setoran
  createSetoran: async (
    data: SetoranPayload,
  ): Promise<ApiResponse<SetoranRecord>> => {
    try {
      const response = await axiosClient.post<ApiResponse<SetoranRecord>>(
        "/setoran",
        data,
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal membuat setoran"));
    }
  },

  // GET /santri (retrieves all santri without 10-item truncation)
  getSantriList: async (): Promise<ApiResponse<Santri[]>> => {
    try {
      const data = await santriService.getAll();
      return { success: true, message: "OK", data };
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil data santri"));
    }
  },

  // GET /setoran/all
  getAllSetoran: async (
    page?: number,
    limit?: number,
    filters?: { startDate?: string; endDate?: string },
  ): Promise<ApiResponse<SetoranRecord[]>> => {
    try {
      if (page !== undefined) {
        const response = await axiosClient.get<GlobalResponseWithPagination<SetoranRecord[]>>(
          "/setoran/all",
          {
            params: { page, limit: limit ?? 100, ...filters },
          },
        );
        return response.data;
      }

      // Loop through pages when fetching all records to avoid 100-item cutoff
      let currentPage = 1;
      let allData: SetoranRecord[] = [];
      let totalPages = 1;
      do {
        const response = await axiosClient.get<GlobalResponseWithPagination<SetoranRecord[]>>(
          "/setoran/all",
          {
            params: { page: currentPage, limit: limit ?? 100, ...filters },
          },
        );
        const items = response.data?.data || [];
        allData = allData.concat(items);
        totalPages = response.data?.pagination?.totalPages || 1;
        currentPage++;
      } while (currentPage <= totalPages && currentPage <= 100);

      return {
        success: true,
        message: "OK",
        data: allData,
      };
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil data setoran"));
    }
  },

  // GET /setoran/santri/:id (loops through pages to avoid 10-item cutoff)
  getSetoranBySantri: async (
    santriId: number,
  ): Promise<ApiResponse<SetoranRecord[]>> => {
    try {
      let page = 1;
      let allData: SetoranRecord[] = [];
      let totalPages = 1;
      do {
        const response = await axiosClient.get<GlobalResponseWithPagination<SetoranRecord[]>>(
          `/setoran/santri/${santriId}`,
          { params: { page, limit: 100 } },
        );
        const items = response.data?.data || [];
        allData = allData.concat(items);
        totalPages = response.data?.pagination?.totalPages || 1;
        page++;
      } while (page <= totalPages && page <= 100);

      return { success: true, message: "OK", data: allData };
    } catch (error: unknown) {
      throw new Error(
        getErrorMessage(error, "Gagal mengambil data setoran santri"),
      );
    }
  },

  // GET /setoran/santri/:id/laporan
  getLaporanHafalan: async (
    santriId: number,
  ): Promise<ApiResponse<LaporanHafalanData>> => {
    try {
      const response = await axiosClient.get<ApiResponse<LaporanHafalanData>>(
        `/setoran/santri/${santriId}/laporan`,
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(
        getErrorMessage(error, "Gagal mengambil laporan hafalan konsolidasi"),
      );
    }
  },

  // PATCH /setoran/:id
  updateSetoran: async (
    id: number,
    data: Partial<SetoranPayload>,
  ): Promise<ApiResponse<SetoranRecord>> => {
    try {
      const response = await axiosClient.patch<ApiResponse<SetoranRecord>>(
        `/setoran/${id}`,
        data,
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memperbarui setoran"));
    }
  },

  // DELETE /setoran/:id
  deleteSetoran: async (
    id: number,
  ): Promise<ApiResponse<{ id_setoran: number }>> => {
    try {
      const response = await axiosClient.delete<
        ApiResponse<{ id_setoran: number }>
      >(`/setoran/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal menghapus setoran"));
    }
  },

  // PATCH /setoran/:id/restore
  restoreSetoran: async (
    id: number,
  ): Promise<ApiResponse<{ id_setoran: number }>> => {
    try {
      const response = await axiosClient.patch<
        ApiResponse<{ id_setoran: number }>
      >(`/setoran/${id}/restore`);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengembalikan setoran"));
    }
  },

  // POST /setoran/verify-ai
  verifyAi: async (audioBlob: Blob): Promise<ApiResponse<{ text: string }>> => {
    try {
      const response = await axiosClient.post<ApiResponse<{ text: string }>>(
        "/setoran/verify-ai",
        audioBlob,
        {
          headers: {
            "Content-Type": audioBlob.type || "audio/wav",
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memverifikasi audio AI"));
    }
  },
};
