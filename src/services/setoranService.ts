import axiosClient from "@/api/axiosClient";
import { type ApiResponse } from "./halaqahService";
import { type Santri } from "./santriService";
import { getErrorMessage } from "@/utils/error";

export interface SetoranPayload {
  santri_id: number;
  juz: number;
  surat: string;
  ayat: string; 
  kategori: "HAFALAN" | "MURAJAAH" | "ZIYADAH" | "INTENS" | "BACAAN";
  taqwim?: number;
  keterangan?: string;
}

export interface SetoranRecord {
  id_setoran: number;
  santri_id: number;
  tanggal_setoran: string;
  juz: number;
  surat: string;
  ayat: string;
  kategori: "HAFALAN" | "MURAJAAH" | "ZIYADAH" | "INTENS" | "BACAAN";
  taqwim: number;
  keterangan: string;
  nilai: number;
  santri?: {
    nama_santri: string;
  };
}


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

  // GET /setoran
  getAllSetoran: async (): Promise<ApiResponse<SetoranRecord[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<SetoranRecord[]>>("/setoran/all");
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil data setoran"));
    }
  },

  // 4. GET /setoran/santri/:id (
  getSetoranBySantri: async (santriId: number): Promise<ApiResponse<SetoranRecord[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<SetoranRecord[]>>(`/setoran/santri/${santriId}`);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil data setoran santri"));
    }
  },
};
