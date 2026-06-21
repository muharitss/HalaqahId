import axiosClient from "@/lib/axiosClient";
import { getErrorMessage } from "@/utils/error";
import { type ApiResponse } from "@/features/halaqah/api/halaqahService";
import { type ProgresSantri } from "../types";
import { type Santri } from "@/features/santri/types";

export const progresService = {
  getAllProgres: async (): Promise<ApiResponse<ProgresSantri[]>> => {
    try {
      const response = await axiosClient.get<ApiResponse<Santri[]>>("/santri");
      
      const rawData: Santri[] = response.data.data || [];

      const mappedData: ProgresSantri[] = rawData.map((item: Santri) => ({
        id: item.id_santri,
        nama: item.nama_santri,
        target: item.target || "REGULER", 
        capaian: 0, 
        status: (item as any).is_active !== false ? "Aktif" : "Nonaktif",
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