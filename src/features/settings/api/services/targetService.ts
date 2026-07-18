import axiosClient from "@/lib/axiosClient";
import { getErrorMessage } from "@/utils/error";
import type {
  TargetSekolah,
  CreateTargetRequest,
  UpdateTargetRequest,
} from "@/types/domain/target";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const targetService = {
  /** Ambil daftar semua target sekolah yang aktif */
  async getAll(): Promise<TargetSekolah[]> {
    try {
      const response = await axiosClient.get<ApiResponse<TargetSekolah[]>>("/target");
      return response.data.data ?? [];
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil data target"));
    }
  },

  /** Buat target baru */
  async create(data: CreateTargetRequest): Promise<TargetSekolah> {
    try {
      const response = await axiosClient.post<ApiResponse<TargetSekolah>>("/target", data);
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal membuat target"));
    }
  },

  /** Update target yang sudah ada */
  async update(id: number, data: UpdateTargetRequest): Promise<TargetSekolah> {
    try {
      const response = await axiosClient.patch<ApiResponse<TargetSekolah>>(`/target/${id}`, data);
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memperbarui target"));
    }
  },

  /** Hapus target (soft-delete) */
  async remove(id: number): Promise<{ affected_santri: number }> {
    try {
      const response = await axiosClient.delete<ApiResponse<{ affected_santri: number }>>(`/target/${id}`);
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal menghapus target"));
    }
  },
};
