import axiosClient from "@/lib/axiosClient";
import { getErrorMessage } from "@/utils/error";
import { type ProgresSantri } from "../types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const progresService = {
  /**
   * Ambil ringkasan progres hafalan semua santri dari backend.
   * Data adalah kalkulasi real berdasarkan setoran aktual vs target yang ditetapkan.
   */
  getAllProgres: async (): Promise<ApiResponse<ProgresSantri[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<ProgresSantri[]>>("/santri/progress");
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil data progres"));
    }
  },
};
