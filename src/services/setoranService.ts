import axiosClient from "@/api/axiosClient";

export interface SetoranPayload {
  santri_id: number;
  juz: number;
  surat: string;
  ayat: string; 
  kategori: "HAFALAN" | "MURAJAAH";
  taqwim?: string; // Penilaian huruf (A, B, Mumtaz)
  keterangan?: string;
}

export interface SetoranResponse {
  id_setoran: number;
  santri_id: number;
  tanggal_setoran: string;
  juz: number;
  surat: string;
  ayat: string;
  kategori: "HAFALAN" | "MURAJAAH";
  taqwim: string;
  keterangan: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: number;
}

export const setoranService = {
  // POST /setoran
  createSetoran: async (data: SetoranPayload): Promise<ApiResponse<SetoranResponse>> => {
    const response = await axiosClient.post<ApiResponse<SetoranResponse>>("/setoran", data);
    return response.data;
  },

  // GET /santri (Untuk dropdown)
  getSantriList: async (): Promise<ApiResponse<any[]>> => {
    const response = await axiosClient.get<ApiResponse<any[]>>("/santri");
    return response.data;
  },

  // GET /setoran
  getAllSetoran: async (): Promise<ApiResponse<any[]>> => {
    const response = await axiosClient.get<ApiResponse<any[]>>("/setoran/all");
    return response.data;
  },
};