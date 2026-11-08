import axiosClient from "@/lib/axiosClient";
import type { ApiResponse } from "@/types/api/common";
import type {
  RubrikTemplate,
  RubrikKriteria,
  TipeRubrik,
  CreateRubrikPayload,
  UpdateRubrikPayload,
  CreateKriteriaPayload,
  UpdateKriteriaPayload,
} from "../../types";

export const rubrikService = {
  getAll: async (tipe?: TipeRubrik): Promise<ApiResponse<RubrikTemplate[]>> => {
    const res = await axiosClient.get<ApiResponse<RubrikTemplate[]>>("/rubrik", {
      params: tipe ? { tipe } : undefined,
    });
    return res.data;
  },

  getById: async (id: number): Promise<ApiResponse<RubrikTemplate>> => {
    const res = await axiosClient.get<ApiResponse<RubrikTemplate>>(`/rubrik/${id}`);
    return res.data;
  },

  create: async (payload: CreateRubrikPayload): Promise<ApiResponse<RubrikTemplate>> => {
    const res = await axiosClient.post<ApiResponse<RubrikTemplate>>("/rubrik", payload);
    return res.data;
  },

  update: async (id: number, payload: UpdateRubrikPayload): Promise<ApiResponse<RubrikTemplate>> => {
    const res = await axiosClient.put<ApiResponse<RubrikTemplate>>(`/rubrik/${id}`, payload);
    return res.data;
  },

  remove: async (id: number): Promise<ApiResponse<null>> => {
    const res = await axiosClient.delete<ApiResponse<null>>(`/rubrik/${id}`);
    return res.data;
  },

  addKriteria: async (
    rubrikId: number,
    payload: CreateKriteriaPayload
  ): Promise<ApiResponse<RubrikKriteria>> => {
    const res = await axiosClient.post<ApiResponse<RubrikKriteria>>(
      `/rubrik/${rubrikId}/kriteria`,
      payload
    );
    return res.data;
  },

  updateKriteria: async (
    rubrikId: number,
    kriteriaId: number,
    payload: UpdateKriteriaPayload
  ): Promise<ApiResponse<RubrikKriteria>> => {
    const res = await axiosClient.put<ApiResponse<RubrikKriteria>>(
      `/rubrik/${rubrikId}/kriteria/${kriteriaId}`,
      payload
    );
    return res.data;
  },

  deleteKriteria: async (
    rubrikId: number,
    kriteriaId: number
  ): Promise<ApiResponse<null>> => {
    const res = await axiosClient.delete<ApiResponse<null>>(
      `/rubrik/${rubrikId}/kriteria/${kriteriaId}`
    );
    return res.data;
  },

  linkKategori: async (
    rubrikId: number,
    id_kategori: number
  ): Promise<ApiResponse<unknown>> => {
    const res = await axiosClient.post<ApiResponse<unknown>>(`/rubrik/${rubrikId}/kategori`, {
      id_kategori,
    });
    return res.data;
  },

  unlinkKategori: async (
    rubrikId: number,
    id_kategori: number
  ): Promise<ApiResponse<unknown>> => {
    const res = await axiosClient.delete<ApiResponse<unknown>>(
      `/rubrik/${rubrikId}/kategori/${id_kategori}`
    );
    return res.data;
  },
};
