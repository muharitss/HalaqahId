import axiosClient from "@/lib/axiosClient";
import type { ApiResponse } from "@/types/api/common";
import type {
  TahunAjaran,
  Semester,
  HariLibur,
  CreateTahunAjaranPayload,
  UpdateTahunAjaranPayload,
  CreateSemesterPayload,
  UpdateSemesterPayload,
  CreateHariLiburPayload,
  UpdateHariLiburPayload,
} from "../../types";

export const akademikService = {
  // ==================== TAHUN AJARAN ====================
  getTahunAjaranList: async (): Promise<ApiResponse<TahunAjaran[]>> => {
    const res = await axiosClient.get<ApiResponse<TahunAjaran[]>>("/tahun-ajaran");
    return res.data;
  },

  getTahunAjaranById: async (id: number): Promise<ApiResponse<TahunAjaran>> => {
    const res = await axiosClient.get<ApiResponse<TahunAjaran>>(`/tahun-ajaran/${id}`);
    return res.data;
  },

  createTahunAjaran: async (
    payload: CreateTahunAjaranPayload
  ): Promise<ApiResponse<TahunAjaran>> => {
    const res = await axiosClient.post<ApiResponse<TahunAjaran>>("/tahun-ajaran", payload);
    return res.data;
  },

  updateTahunAjaran: async (
    id: number,
    payload: UpdateTahunAjaranPayload
  ): Promise<ApiResponse<TahunAjaran>> => {
    const res = await axiosClient.put<ApiResponse<TahunAjaran>>(`/tahun-ajaran/${id}`, payload);
    return res.data;
  },

  deleteTahunAjaran: async (id: number): Promise<ApiResponse<null>> => {
    const res = await axiosClient.delete<ApiResponse<null>>(`/tahun-ajaran/${id}`);
    return res.data;
  },

  // ==================== SEMESTER ====================
  getSemesters: async (idTahunAjaran: number): Promise<ApiResponse<Semester[]>> => {
    const res = await axiosClient.get<ApiResponse<Semester[]>>(
      `/tahun-ajaran/${idTahunAjaran}/semester`
    );
    return res.data;
  },

  createSemester: async (
    idTahunAjaran: number,
    payload: CreateSemesterPayload
  ): Promise<ApiResponse<Semester>> => {
    const res = await axiosClient.post<ApiResponse<Semester>>(
      `/tahun-ajaran/${idTahunAjaran}/semester`,
      payload
    );
    return res.data;
  },

  updateSemester: async (
    idTahunAjaran: number,
    idSemester: number,
    payload: UpdateSemesterPayload
  ): Promise<ApiResponse<Semester>> => {
    const res = await axiosClient.put<ApiResponse<Semester>>(
      `/tahun-ajaran/${idTahunAjaran}/semester/${idSemester}`,
      payload
    );
    return res.data;
  },

  deleteSemester: async (
    idTahunAjaran: number,
    idSemester: number
  ): Promise<ApiResponse<null>> => {
    const res = await axiosClient.delete<ApiResponse<null>>(
      `/tahun-ajaran/${idTahunAjaran}/semester/${idSemester}`
    );
    return res.data;
  },

  // ==================== HARI LIBUR ====================
  getHariLiburList: async (tahun?: number): Promise<ApiResponse<HariLibur[]>> => {
    const res = await axiosClient.get<ApiResponse<HariLibur[]>>("/hari-libur", {
      params: tahun ? { tahun } : undefined,
    });
    return res.data;
  },

  getHariLiburById: async (id: number): Promise<ApiResponse<HariLibur>> => {
    const res = await axiosClient.get<ApiResponse<HariLibur>>(`/hari-libur/${id}`);
    return res.data;
  },

  createHariLibur: async (
    payload: CreateHariLiburPayload
  ): Promise<ApiResponse<HariLibur>> => {
    const res = await axiosClient.post<ApiResponse<HariLibur>>("/hari-libur", payload);
    return res.data;
  },

  updateHariLibur: async (
    id: number,
    payload: UpdateHariLiburPayload
  ): Promise<ApiResponse<HariLibur>> => {
    const res = await axiosClient.put<ApiResponse<HariLibur>>(`/hari-libur/${id}`, payload);
    return res.data;
  },

  deleteHariLibur: async (id: number): Promise<ApiResponse<null>> => {
    const res = await axiosClient.delete<ApiResponse<null>>(`/hari-libur/${id}`);
    return res.data;
  },
};
