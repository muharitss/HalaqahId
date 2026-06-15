import axiosClient from "@/api/axiosClient";
import { type ApiResponse } from "@/services/halaqahService";
import { type SesiHalaqah } from "@/types/domain/sesi-halaqah";

export const sesiService = {
  getSesiHalaqah: async (): Promise<ApiResponse<SesiHalaqah[]>> => {
    try {
      const res = await axiosClient.get<ApiResponse<SesiHalaqah[]>>("/sesi-halaqah");
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Gagal mengambil sesi halaqah");
    }
  },
};
