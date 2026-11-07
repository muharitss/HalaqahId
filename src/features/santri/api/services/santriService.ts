import axiosClient from "@/lib/axiosClient";
import { getErrorMessage } from "@/utils/error";
import {
  type Santri,
  type CreateSantriData,
  type UpdateSantriData,
  type RiwayatHalaqahItem,
  type PindahHalaqahRequest,
  type RiwayatAkademikItem,
  type NaikLevelRequest,
  type BatchNaikTahunRequest,
  type BatchNaikTahunResponse,
} from "../../types";

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
      const response = await axiosClient.get("/santri", { params: { limit: 1000 } });
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

  // 5.5 Restore Santri
  async restore(id: number): Promise<void> {
    try {
      await axiosClient.patch(`/santri/${id}/restore`);
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengembalikan santri"));
    }
  },

  // 6. Search Santri
  async search(query: string): Promise<Santri[]> {
    try {
      const santriList = await this.getAll();
      return santriList.filter(s => 
        s.nama_santri.toLowerCase().includes(query.toLowerCase()) ||
        (s.nomor_telepon && s.nomor_telepon.includes(query))
      );
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mencari santri"));
    }
  },

  async getByHalaqahId(idHalaqah: number): Promise<Santri[]> {
    try {
      const response = await axiosClient.get(`/halaqah/${idHalaqah}`);
      const data = response.data.data;

      if (data && Array.isArray(data.santri)) {
        return data.santri;
      }
      
      return []; 
    } catch (error: unknown) {
      console.error("Error getByHalaqahId:", error);
      return []; 
    }
  },

  // 7. Get Riwayat Halaqah Santri
  async getRiwayatHalaqah(id: number): Promise<RiwayatHalaqahItem[]> {
    try {
      const response = await axiosClient.get(`/santri/${id}/riwayat-halaqah`);
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil riwayat halaqah santri"));
    }
  },

  // 8. Pindah Halaqah Santri
  async pindahHalaqah(id: number, data: PindahHalaqahRequest): Promise<unknown> {
    try {
      const response = await axiosClient.post(`/santri/${id}/pindah-halaqah`, data);
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memindahkan santri"));
    }
  },

  // 9. Get Riwayat Akademik Santri
  async getRiwayatAkademik(id: number): Promise<RiwayatAkademikItem[]> {
    try {
      const response = await axiosClient.get(`/santri/${id}/riwayat-akademik`);
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil riwayat akademik santri"));
    }
  },

  // 10. Naik Level Santri
  async naikLevel(id: number, data: NaikLevelRequest): Promise<unknown> {
    try {
      const response = await axiosClient.post(`/santri/${id}/naik-level`, data);
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal menaikkan level santri"));
    }
  },

  // 11. Batch Naik Tahun Ajaran & Level
  async batchNaikTahun(data: BatchNaikTahunRequest): Promise<BatchNaikTahunResponse> {
    try {
      const response = await axiosClient.post("/batch/naik-tahun", data);
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memproses batch kenaikan tahun ajaran"));
    }
  },
};
