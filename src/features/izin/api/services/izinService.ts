import axiosClient from "@/lib/axiosClient";
import { getErrorMessage } from "@/utils/error";
import type { ApiResponse } from "@/types/api/common";
import type { GlobalResponseWithPagination } from "@/types/api/global-response";
import type {
  IzinSantri,
  AjukanIzinRequest,
  ApprovalIzinRequest,
  IzinFilterParams,
} from "../../types";

export const izinService = {
  getIzinList: async (
    params?: IzinFilterParams
  ): Promise<GlobalResponseWithPagination<IzinSantri[]>> => {
    try {
      const res = await axiosClient.get<GlobalResponseWithPagination<IzinSantri[]>>("/izin", {
        params,
      });
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memuat daftar izin santri"));
    }
  },

  getAllIzin: async (
    params?: Omit<IzinFilterParams, "page" | "limit">
  ): Promise<IzinSantri[]> => {
    try {
      let page = 1;
      let allData: IzinSantri[] = [];
      let totalPages = 1;
      do {
        const res = await axiosClient.get<GlobalResponseWithPagination<IzinSantri[]>>("/izin", {
          params: { ...params, page, limit: 100 },
        });
        const items = res.data?.data || [];
        allData = allData.concat(items);
        totalPages = res.data?.pagination?.totalPages || 1;
        page++;
      } while (page <= totalPages && page <= 100);
      return allData;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memuat daftar izin santri"));
    }
  },

  getIzinDetail: async (id: number): Promise<ApiResponse<IzinSantri>> => {
    try {
      const res = await axiosClient.get<ApiResponse<IzinSantri>>(`/izin/${id}`);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memuat detail izin santri"));
    }
  },

  ajukanIzin: async (payload: AjukanIzinRequest): Promise<ApiResponse<IzinSantri>> => {
    try {
      const res = await axiosClient.post<ApiResponse<IzinSantri>>("/izin", payload);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengajukan izin santri"));
    }
  },

  approveIzin: async (
    id: number,
    payload?: ApprovalIzinRequest
  ): Promise<ApiResponse<IzinSantri>> => {
    try {
      const res = await axiosClient.put<ApiResponse<IzinSantri>>(`/izin/${id}/approve`, payload || {});
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal menyetujui izin santri"));
    }
  },

  rejectIzin: async (
    id: number,
    payload?: ApprovalIzinRequest
  ): Promise<ApiResponse<IzinSantri>> => {
    try {
      const res = await axiosClient.put<ApiResponse<IzinSantri>>(`/izin/${id}/reject`, payload || {});
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal menolak izin santri"));
    }
  },
};
