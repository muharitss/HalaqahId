import axiosClient from "@/lib/axiosClient";
import type { GlobalResponseWithPagination, GlobalResponse } from "@/types/api/global-response";
import type {
  PengumumanItem,
  CreatePengumumanPayload,
  UpdatePengumumanPayload,
  PengumumanFilterQuery,
  UnreadCountResponseData,
} from "../../types";

export const pengumumanService = {
  getPengumumanList: async (
    params?: PengumumanFilterQuery
  ): Promise<GlobalResponseWithPagination<PengumumanItem[]>> => {
    const res = await axiosClient.get<GlobalResponseWithPagination<PengumumanItem[]>>(
      "/pengumuman",
      { params }
    );
    return res.data;
  },

  getPengumumanDetail: async (
    id: number
  ): Promise<GlobalResponse<PengumumanItem>> => {
    const res = await axiosClient.get<GlobalResponse<PengumumanItem>>(
      `/pengumuman/${id}`
    );
    return res.data;
  },

  getUnreadCount: async (): Promise<GlobalResponse<UnreadCountResponseData>> => {
    const res = await axiosClient.get<GlobalResponse<UnreadCountResponseData>>(
      "/pengumuman/unread-count"
    );
    return res.data;
  },

  createPengumuman: async (
    payload: CreatePengumumanPayload
  ): Promise<GlobalResponse<PengumumanItem>> => {
    const res = await axiosClient.post<GlobalResponse<PengumumanItem>>(
      "/pengumuman",
      payload
    );
    return res.data;
  },

  updatePengumuman: async (
    id: number,
    payload: UpdatePengumumanPayload
  ): Promise<GlobalResponse<PengumumanItem>> => {
    const res = await axiosClient.put<GlobalResponse<PengumumanItem>>(
      `/pengumuman/${id}`,
      payload
    );
    return res.data;
  },

  deletePengumuman: async (
    id: number
  ): Promise<GlobalResponse<{ id_pengumuman: number; message: string }>> => {
    const res = await axiosClient.delete<
      GlobalResponse<{ id_pengumuman: number; message: string }>
    >(`/pengumuman/${id}`);
    return res.data;
  },

  markAsRead: async (
    id: number
  ): Promise<GlobalResponse<{ success: boolean }>> => {
    const res = await axiosClient.post<GlobalResponse<{ success: boolean }>>(
      `/pengumuman/${id}/read`
    );
    return res.data;
  },
};
