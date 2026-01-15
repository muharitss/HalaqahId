import axiosClient from "@/api/axiosClient";

export interface SetoranPayload {
  santri_id: number;
  juz: number;
  surat: string;
  ayat: string; // Format "1-10"
  kategori: "HAFALAN" | "MURAJAAH";
  taqwim?: string; // Penilaian huruf (A, B, Mumtaz)
  keterangan?: string;
}

export interface SetoranResponse {
  id_setoran: number;
  // ... field lainnya sesuai response backend
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
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
  
  // Ambil history berdasarkan tanggal
  getSetoranByDate: async (date: string): Promise<ApiResponse<any[]>> => {
    const response = await axiosClient.get<ApiResponse<any[]>>(`/setoran?date=${date}`);
    return response.data;
  }
};