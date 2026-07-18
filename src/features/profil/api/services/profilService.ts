import axiosClient from "@/lib/axiosClient";
import { getErrorMessage } from "@/utils/error";
import type { GlobalResponse } from "@/types/api/global-response";
import type { ProfilFormValues } from "../../types";

export const profilService = {
  /**
   * Update data profil muhafiz (nama & nomor_telepon) untuk user yang sedang login.
   */
  updateProfil: async (
    _userId: number,
    data: Partial<ProfilFormValues>
  ): Promise<GlobalResponse<{ id_user: number; name: string; nomor_telepon?: string | null }>> => {
    try {
      const response = await axiosClient.patch(
        `/halaqah/auth/me`,
        data
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memperbarui profil"));
    }
  },

  /**
   * Ganti password dengan verifikasi password lama untuk user yang sedang login.
   */
  gantiPassword: async (
    _userId: number,
    data: { password_lama: string; password_baru: string }
  ): Promise<GlobalResponse<null>> => {
    try {
      const response = await axiosClient.patch(
        `/halaqah/auth/me/password`,
        data
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengganti password"));
    }
  },
};
