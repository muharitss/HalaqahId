import axiosClient from "@/lib/axiosClient";
import type { ApiResponse } from "@/types/api/common";
import type {
  SurahProgressItem,
  ProgressSummaryData,
  UpdateProgressPayload,
  BackfillProgressResult,
} from "../../types";

export const progressService = {
  getProgressList: async (
    santriId: number,
    params?: { status?: string; search?: string }
  ): Promise<ApiResponse<SurahProgressItem[]>> => {
    const res = await axiosClient.get<ApiResponse<SurahProgressItem[]>>(
      `/santri/${santriId}/progress`,
      { params }
    );
    return res.data;
  },

  getSummary: async (santriId: number): Promise<ApiResponse<ProgressSummaryData>> => {
    const res = await axiosClient.get<ApiResponse<ProgressSummaryData>>(
      `/santri/${santriId}/progress/summary`
    );
    return res.data;
  },

  updateProgress: async (
    santriId: number,
    suratId: number,
    payload: UpdateProgressPayload
  ): Promise<ApiResponse<SurahProgressItem>> => {
    const res = await axiosClient.put<ApiResponse<SurahProgressItem>>(
      `/santri/${santriId}/progress/${suratId}`,
      payload
    );
    return res.data;
  },

  backfill: async (santriId: number): Promise<ApiResponse<BackfillProgressResult>> => {
    const res = await axiosClient.post<ApiResponse<BackfillProgressResult>>(
      `/santri/${santriId}/progress/backfill`
    );
    return res.data;
  },
};
