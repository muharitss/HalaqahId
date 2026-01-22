// services/progresService.ts
import axiosClient from "@/api/axiosClient";

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
    const response = await axiosClient.get<ApiResponse<any[]>>("/santri");
    
    const rawData = response.data.data || [];

    const mappedData = rawData.map((item: any) => ({
      id: item.id_santri || item.id,
      nama: item.nama_santri || item.nama || item.name,
      target: item.target_tipe || "REGULER", 
      capaian: 0, 
      status: "Aktif",
      terakhirSetor: "-",
      totalAyat: 0
    }));

    return {
      ...response.data,
      data: mappedData
    };
  },
};

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
