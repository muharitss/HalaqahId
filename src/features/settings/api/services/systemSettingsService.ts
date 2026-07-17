import axiosClient from "@/lib/axiosClient";
import { getErrorMessage } from "@/utils/error";
import { type ApiResponse } from "@/features/halaqah/api/halaqahService";

export interface SystemSettingItem {
  key: string;
  value: string;
  description: string;
  updated_at: string;
}

export const systemSettingsService = {
  getSettings: async (): Promise<ApiResponse<SystemSettingItem[]>> => {
    try {
      const res = await axiosClient.get<ApiResponse<SystemSettingItem[]>>("/system-settings");
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil pengaturan sistem"));
    }
  },

  updateSettings: async (settings: Record<string, string>): Promise<ApiResponse<SystemSettingItem[]>> => {
    try {
      const res = await axiosClient.put<ApiResponse<SystemSettingItem[]>>("/system-settings", settings);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memperbarui pengaturan sistem"));
    }
  },
};
