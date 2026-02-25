import axiosClient from "@/api/axiosClient";
import { getErrorMessage } from "@/utils/error";
import { type ApiResponse } from "@/services/halaqahService";
import { type SetoranPayload, type SetoranRecord } from "../types";
import { type Santri } from "../../kelola-santri/types";

export const setoranService = {
  // POST /setoran
  createSetoran: async (data: SetoranPayload): Promise<ApiResponse<SetoranRecord>> => {
    try {
      const response = await axiosClient.post<ApiResponse<SetoranRecord>>("/setoran", data);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal membuat setoran"));
    }
  },

  // GET /santri 
  getSantriList: async (): Promise<ApiResponse<Santri[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<Santri[]>>("/santri");
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil data santri"));
    }
  },

  // GET /setoran/all
  getAllSetoran: async (): Promise<ApiResponse<SetoranRecord[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<SetoranRecord[]>>("/setoran/all");
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil data setoran"));
    }
  },

  // GET /setoran/santri/:id
  getSetoranBySantri: async (santriId: number): Promise<ApiResponse<SetoranRecord[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<SetoranRecord[]>>(`/setoran/santri/${santriId}`);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil data setoran santri"));
    }
  },
};