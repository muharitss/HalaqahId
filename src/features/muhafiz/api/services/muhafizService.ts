import axiosClient from "@/lib/axiosClient";
import { getErrorMessage } from "@/utils/error";
import { type Muhafiz } from "../../types";
import type { GlobalResponse } from "@/types/api/global-response";

/** Struktur satu item absensi harian muhafiz dari endpoint GET /absensi/muhafiz/harian */
export interface DailyAbsensiMuhafizItem {
  id_absensi: number;
  id_user: number;
  id_sesi: number | null;
  status: string;
  keterangan: string | null;
}

function normalizeMuhafiz(m: any): Muhafiz {
  if (!m) return m;
  let halaqah = m.halaqah;
  if (Array.isArray(halaqah)) {
    if (halaqah.length === 0) {
      halaqah = null;
    } else {
      const first = halaqah[0];
      const sesiList = halaqah.flatMap((h: any) => h.halaqah_sesi || h.sesi_halaqahs || []);
      const uniqueSesi = Array.from(new Map(sesiList.map((s: any) => [s.id_sesi, s])).values());
      const name = halaqah.map((h: any) => h.name_halaqah || h.nama_halaqah).filter(Boolean).join(", ");
      halaqah = {
        id_halaqah: first.id_halaqah,
        name_halaqah: name || first.name_halaqah || first.nama_halaqah || "",
        nama_halaqah: name || first.nama_halaqah || first.name_halaqah || "",
        sesi_halaqahs: uniqueSesi,
        halaqah_sesi: uniqueSesi,
      };
    }
  } else if (halaqah && typeof halaqah === "object") {
    const sesi = halaqah.halaqah_sesi || halaqah.sesi_halaqahs || [];
    halaqah = {
      ...halaqah,
      name_halaqah: halaqah.name_halaqah || halaqah.nama_halaqah || "",
      nama_halaqah: halaqah.nama_halaqah || halaqah.name_halaqah || "",
      sesi_halaqahs: sesi,
      halaqah_sesi: sesi,
    };
  }

  return {
    ...m,
    halaqah,
  };
}

export const muhafizService = {
  // Get all muhafiz (loops through pages if full list requested)
  getAllMuhafiz: async (params?: { page?: number; limit?: number }): Promise<Muhafiz[]> => {
    try {
      const extractItems = (resData: any): Muhafiz[] => {
        if (resData?.data && Array.isArray(resData.data)) {
          return resData.data.map(normalizeMuhafiz);
        }
        if (Array.isArray(resData)) {
          return resData.map(normalizeMuhafiz);
        }
        return [];
      };

      if (params?.page) {
        const response = await axiosClient.get<GlobalResponse<Muhafiz[]>>("/halaqah/auth/muhafiz", {
          params: { limit: 100, ...params },
        });
        return extractItems(response.data);
      }

      let page = 1;
      let allData: Muhafiz[] = [];
      let totalPages = 1;
      do {
        const response = await axiosClient.get<any>("/halaqah/auth/muhafiz", {
          params: { page, limit: 100 },
        });
        const items = extractItems(response.data);
        allData = allData.concat(items);
        totalPages = response.data?.pagination?.totalPages || 1;
        page++;
      } while (page <= totalPages && page <= 100);

      return allData;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, "Gagal mengambil data muhafiz");
      console.error("Error getAllMuhafiz:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Get muhafiz by ID
  getMuhafizById: async (userId: number): Promise<Muhafiz> => {
    try {
      const response = await axiosClient.get<GlobalResponse<Muhafiz>>(`/halaqah/auth/muhafiz/${userId}`);
      if (!response.data.data) throw new Error("Data muhafiz tidak ditemukan");
      return normalizeMuhafiz(response.data.data);
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil detail muhafiz"));
    }
  },

  // Search muhafiz
  searchMuhafiz: async (keyword: string): Promise<Muhafiz[]> => {
    try {
      const allData = await muhafizService.getAllMuhafiz();
      if (!keyword) return allData;
      const term = keyword.toLowerCase();
      return allData.filter(
        (muhafiz) =>
          muhafiz.name.toLowerCase().includes(term) ||
          muhafiz.email.toLowerCase().includes(term)
      );
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mencari muhafiz"));
    }
  },

  // Create new muhafiz - Register
  createMuhafiz: async (data: { name: string; email: string; password: string; nomor_telepon?: string }) => {
    try {
      const response = await axiosClient.post<GlobalResponse<{ user: Muhafiz }>>("/halaqah/auth/register", data);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mendaftar muhafiz"));
    }
  },

  updateAbsensiAsatidz: async (id: number, payload: { status: string; keterangan?: string }) => {
    try {
      const res = await axiosClient.patch(`/absensi/muhafiz/${id}`, payload);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memperbarui absensi muhafiz"));
    }
  },

  // Update muhafiz
  updateMuhafiz: async (userId: number, data: { name?: string; email?: string; nomor_telepon?: string | null }) => {
    try {
      const response = await axiosClient.patch<GlobalResponse<Muhafiz>>(`/halaqah/auth/muhafiz/${userId}`, data);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memperbarui muhafiz"));
    }
  },

  // Delete muhafiz (soft delete)
  deleteMuhafiz: async (userId: number) => {
    try {
      const response = await axiosClient.delete<GlobalResponse<null>>(`/halaqah/auth/muhafiz/${userId}`);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal menghapus muhafiz"));
    }
  },

  // Impersonate muhafiz
  impersonateMuhafiz: async (userId: number) => {
    try {
      const response = await axiosClient.post<GlobalResponse<{ user: Muhafiz; token: string }>>(
        `/halaqah/auth/impersonate/${userId}`
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal melakukan impersonasi"));
    }
  },

  // Get deleted muhafiz (trash)
  getDeletedMuhafiz: async (): Promise<Muhafiz[]> => {
    try {
      const response = await axiosClient.get<GlobalResponse<Muhafiz[]>>("/halaqah/auth/muhafiz/deleted");
      return (response.data.data || []).map(normalizeMuhafiz);
    } catch (error: unknown) {
      console.error("Gagal mengambil data tempat sampah:", error);
      return [];
    }
  },

  // Restore muhafiz
  restoreMuhafiz: async (userId: number) => {
    try {
      const response = await axiosClient.patch<GlobalResponse<Muhafiz>>(`/halaqah/auth/muhafiz/restore/${userId}`, {});
      return {
        ...response.data,
        data: response.data.data ? normalizeMuhafiz(response.data.data) : response.data.data,
      };
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memulihkan muhafiz"));
    }
  },

  // Get active muhafiz IDs
  getActiveMuhafizIds: async (): Promise<Set<number>> => {
    try {
      // Implementasi sesuai kebutuhan di masa depan
      return new Set();
    } catch (error) {
      console.error("Gagal mengecek status aktif muhafiz", error);
      return new Set();
    }
  },

  catatAbsensiAsatidz: async (
    payload:
      | { id_user: number; id_sesi?: number; status: string; tanggal: string; keterangan?: string }
      | Array<{ id_user: number; id_sesi?: number; status: string; tanggal: string; keterangan?: string }>
  ) => {
    try {
      const res = await axiosClient.post("/absensi/muhafiz", payload);
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mencatat absensi muhafiz"));
    }
  },

  /**
   * Mengambil absensi harian muhafiz untuk tanggal dan sesi tertentu.
   * Filter dilakukan di server untuk efisiensi dan akurasi.
   */
  getDailyAsatidz: async (
    dateString: string,
    id_sesi?: number,
  ): Promise<GlobalResponse<DailyAbsensiMuhafizItem[]>> => {
    try {
      const params = new URLSearchParams({ date: dateString });
      if (id_sesi !== undefined) params.set("id_sesi", String(id_sesi));

      const res = await axiosClient.get<GlobalResponse<DailyAbsensiMuhafizItem[]>>(
        `/absensi/muhafiz/harian?${params}`,
      );
      return res.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal mengambil data absensi harian muhafiz"));
    }
  },

  getMonthlyAsatidz: async (month: number, year: number) => {
    try {
      const res = await axiosClient.get(`/absensi/rekap-muhafiz?month=${month}&year=${year}`);
      return res.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Gagal mengambil rekap bulanan"));
    }
  },
};
