import axiosClient from "@/lib/axiosClient";
import { getErrorMessage } from "@/utils/error";
import type { GlobalResponse } from "@/types/api/global-response";
import type {
  SantriWali,
  CreateSantriWaliRequest,
  UpdateSantriWaliRequest,
} from "@/types/domain/santri-wali";

export const santriWaliService = {
  // 1. Get Wali List for a santri
  async getWaliList(santriId: number): Promise<SantriWali[]> {
    try {
      const response = await axiosClient.get<GlobalResponse<SantriWali[]>>(
        `/santri/${santriId}/wali`
      );
      return response.data.data ?? [];
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil daftar wali santri"));
    }
  },

  // 2. Create Wali
  async createWali(santriId: number, data: CreateSantriWaliRequest): Promise<SantriWali> {
    try {
      const response = await axiosClient.post<GlobalResponse<SantriWali>>(
        `/santri/${santriId}/wali`,
        data
      );
      if (!response.data.data) {
        throw new Error("Data wali tidak ditemukan pada response");
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal menambahkan wali santri"));
    }
  },

  // 3. Update Wali
  async updateWali(
    santriId: number,
    waliId: number,
    data: UpdateSantriWaliRequest
  ): Promise<SantriWali> {
    try {
      const response = await axiosClient.put<GlobalResponse<SantriWali>>(
        `/santri/${santriId}/wali/${waliId}`,
        data
      );
      if (!response.data.data) {
        throw new Error("Data wali tidak ditemukan pada response");
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memperbarui data wali"));
    }
  },

  // 4. Delete Wali
  async deleteWali(santriId: number, waliId: number): Promise<void> {
    try {
      await axiosClient.delete(`/santri/${santriId}/wali/${waliId}`);
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal menghapus wali santri"));
    }
  },

  // 5. Set Primary Contact
  async setPrimaryContact(santriId: number, waliId: number): Promise<SantriWali> {
    return this.updateWali(santriId, waliId, { is_primary_contact: true });
  },
};

export default santriWaliService;
