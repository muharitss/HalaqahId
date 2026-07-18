import axiosClient from "@/lib/axiosClient";
import { getErrorMessage } from "@/utils/error";
import { type ApiResponse } from "@/features/halaqah/api/halaqahService";
import { type Sekolah, type UpdateSekolahRequest, type SekolahWithCount, type SekolahListResponse } from "@/types/domain/sekolah";

export interface KategoriSetoranResponse {
  id_kategori: number;
  nama_kategori: string;
  deskripsi: string | null;
  perlu_validasi_urutan?: boolean;
}

export const sekolahService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<SekolahWithCount[]> & { pagination?: SekolahListResponse }> => {
    try {
      const res = await axiosClient.get<ApiResponse<SekolahWithCount[]> & { pagination?: SekolahListResponse }>(
        "/sekolah/all",
        { params }
      );
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil daftar sekolah"));
    }
  },

  createSekolah: async (data: {
    nama_sekolah: string;
    jenis_lembaga?: string;
    alamat?: string;
    admin_name: string;
    admin_email: string;
    admin_password?: string;
  }): Promise<ApiResponse<{ sekolah: Sekolah; user: any }>> => {
    try {
      const res = await axiosClient.post<ApiResponse<{ sekolah: Sekolah; user: any }>>("/sekolah", data);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal membuat sekolah baru"));
    }
  },

  updateSekolah: async (
    id: number,
    data: Partial<UpdateSekolahRequest>
  ): Promise<ApiResponse<Sekolah>> => {
    try {
      const res = await axiosClient.patch<ApiResponse<Sekolah>>(`/sekolah/${id}`, data);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memperbarui sekolah"));
    }
  },

  deleteSekolah: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const res = await axiosClient.delete<ApiResponse<null>>(`/sekolah/${id}`);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal menghapus sekolah"));
    }
  },
  
  getProfile: async (): Promise<ApiResponse<Sekolah>> => {
    try {
      const res = await axiosClient.get<ApiResponse<Sekolah>>("/sekolah");
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil profil sekolah"));
    }
  },

  updateProfile: async (data: UpdateSekolahRequest): Promise<ApiResponse<Sekolah>> => {
    try {
      const res = await axiosClient.patch<ApiResponse<Sekolah>>("/sekolah", data);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memperbarui profil sekolah"));
    }
  },

  // ── Kategori Setoran Sekolah API ──
  getKategori: async (): Promise<ApiResponse<KategoriSetoranResponse[]>> => {
    try {
      const res = await axiosClient.get<ApiResponse<KategoriSetoranResponse[]>>("/sekolah/kategori");
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil kategori setoran"));
    }
  },

  createKategori: async (data: {
    nama_kategori: string;
    deskripsi?: string;
    perlu_validasi_urutan?: boolean;
  }): Promise<ApiResponse<KategoriSetoranResponse>> => {
    try {
      const res = await axiosClient.post<ApiResponse<KategoriSetoranResponse>>("/sekolah/kategori", data);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal menambahkan kategori setoran"));
    }
  },

  updateKategori: async (
    id: number,
    data: {
      nama_kategori?: string;
      deskripsi?: string | null;
      perlu_validasi_urutan?: boolean;
    }
  ): Promise<ApiResponse<KategoriSetoranResponse>> => {
    try {
      const res = await axiosClient.patch<ApiResponse<KategoriSetoranResponse>>(`/sekolah/kategori/${id}`, data);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memperbarui kategori setoran"));
    }
  },

  deleteKategori: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const res = await axiosClient.delete<ApiResponse<null>>(`/sekolah/kategori/${id}`);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal menghapus kategori setoran"));
    }
  },

  getSystemHealth: async (): Promise<ApiResponse<{
    health: {
      status: string;
      dbLatencyMs: number;
      memoryUsage: {
        rss: number;
        heapTotal: number;
        heapUsed: number;
      };
      uptime: number;
    };
    stats: {
      totalSchools: number;
      totalUsers: number;
      totalSantri: number;
      totalHalaqah: number;
      totalSetoran: number;
    };
  }>> => {
    try {
      const res = await axiosClient.get<ApiResponse<any>>("/sekolah/superadmin/health");
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil data kesehatan sistem"));
    }
  },

  getDeletedSchools: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<Sekolah[]>> => {
    try {
      const res = await axiosClient.get<ApiResponse<Sekolah[]>>("/sekolah/deleted/all", { params });
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil daftar sekolah terhapus"));
    }
  },

  restoreSekolah: async (id: number): Promise<ApiResponse<Sekolah>> => {
    try {
      const res = await axiosClient.patch<ApiResponse<Sekolah>>(`/sekolah/${id}/restore`);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memulihkan sekolah"));
    }
  },

  getJuzDistribution: async (): Promise<ApiResponse<{
    distribution: { juz: number; total_santri: number }[];
    belum_setoran: number;
    total_santri: number;
  }>> => {
    try {
      const res = await axiosClient.get<ApiResponse<any>>("/sekolah/dashboard/juz-distribution");
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil data distribusi juz"));
    }
  }
};
