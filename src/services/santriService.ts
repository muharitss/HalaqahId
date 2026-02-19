import axiosClient from "@/api/axiosClient";
import { getErrorMessage } from "@/utils/error";

export interface Santri {
  id_santri: number;
  nama_santri: string;
  nomor_telepon: string;
  target: "RINGAN" | "SEDANG" | "INTENSE";
  halaqah_id: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface CreateSantriData {
  nama_santri: string;
  nomor_telepon: string;
  target: "RINGAN" | "SEDANG" | "INTENSE";
  halaqah_id: number; 
}

export type UpdateSantriData = Partial<CreateSantriData>;


export interface SantriStats {
  total: number;
  active: number;
  inactive: number;
  ringan: number;
  sedang: number;
  intense: number;
}

export const santriService = {
  // 1. Create Santri
  async create(data: CreateSantriData): Promise<Santri> {
    try {
      const response = await axiosClient.post("/santri", data);
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal menambah santri"));
    }
  },

  // 2. Get Santri List (Auto-Filter berdasarkan role)
  async getAll(): Promise<Santri[]> {
    try {
      const response = await axiosClient.get("/santri");
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil data santri"));
    }
  },

  // 3. Get Santri by ID
  async getById(id: number): Promise<Santri> {
    try {
      const response = await axiosClient.get(`/santri/${id}`);
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil data santri"));
    }
  },

  // 4. Update Santri
  async update(id: number, data: UpdateSantriData): Promise<Santri> {
    try {
      const response = await axiosClient.patch(`/santri/${id}`, data);
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memperbarui santri"));
    }
  },

  // 5. Soft Delete Santri
  async delete(id: number): Promise<void> {
    try {
      await axiosClient.delete(`/santri/${id}`);
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal menghapus santri"));
    }
  },

  // 6. Search Santri
  async search(query: string): Promise<Santri[]> {
    try {
      const santriList = await this.getAll();
      return santriList.filter(s => 
        s.nama_santri.toLowerCase().includes(query.toLowerCase()) ||
        s.nomor_telepon.includes(query)
      );
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mencari santri"));
    }
  }
};
