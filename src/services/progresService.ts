// services/progresService.ts
import axiosClient from "@/api/axiosClient";
import { type ApiResponse } from "./halaqahService";
import { type Santri } from "./santriService";
import { getErrorMessage } from "@/utils/error";

export interface ProgresSantri {
  id: number;
  nama: string;
  target: string;
  capaian: number;
  status: string;
  terakhirSetor: string;
  totalAyat: number;
}

export const progresService = {
  getAllProgres: async (): Promise<ApiResponse<ProgresSantri[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<Santri[]>>("/santri");
      
      const rawData = response.data.data || [];

      const mappedData: ProgresSantri[] = rawData.map((item) => ({
        id: item.id_santri,
        nama: item.nama_santri,
        target: item.target || "REGULER", 
        capaian: 0, 
        status: item.is_active ? "Aktif" : "Nonaktif",
        terakhirSetor: "-",
        totalAyat: 0
      }));

      return {
        ...response.data,
        data: mappedData
      };
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil data progres"));
    }
  },
};

