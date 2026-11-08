import axios from "axios";
import { getErrorMessage } from "@/utils/error";
import type { GlobalResponse } from "@/types/api/global-response";
import type {
  VerifyPortalPayload,
  PortalSessionData,
  PortalSantriProfile,
  PortalProgressResponse,
  PortalSetoranResponse,
  PortalAbsensiResponse,
  PortalUjianRecord,
  PortalSetoranRecord,
  PortalAbsensiRecord,
  PortalAbsensiSummary,
  PortalPagination,
} from "../../types";

export const PORTAL_TOKEN_KEY = "portal_token";
export const PORTAL_SESSION_KEY = "portal_session";

export const portalClient = axios.create({
  baseURL: import.meta.env?.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

portalClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(PORTAL_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const portalService = {
  // 1. Verifikasi Akses Portal
  async verify(payload: VerifyPortalPayload): Promise<PortalSessionData> {
    try {
      const response = await portalClient.post<GlobalResponse<PortalSessionData>>(
        "/portal/verify",
        payload
      );
      if (!response.data.data) {
        throw new Error(response.data.message || "Gagal verifikasi portal");
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memverifikasi akses portal wali"));
    }
  },

  // 2. Logout Portal Wali
  async logout(): Promise<void> {
    try {
      await portalClient.post<GlobalResponse<null>>("/portal/logout");
    } catch {
      // Non-blocking logout call
    }
  },

  // 3. Profil Santri Terkait
  async getSantri(): Promise<PortalSantriProfile> {
    try {
      const response = await portalClient.get<GlobalResponse<PortalSantriProfile>>(
        "/portal/santri"
      );
      if (!response.data.data) {
        throw new Error("Data profil santri tidak ditemukan");
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memuat profil santri"));
    }
  },

  // 4. Progress Hafalan Santri
  async getProgress(): Promise<PortalProgressResponse> {
    try {
      const response = await portalClient.get<GlobalResponse<PortalProgressResponse>>(
        "/portal/progress"
      );
      if (!response.data.data) {
        throw new Error("Data progress hafalan tidak ditemukan");
      }
      return response.data.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memuat progress hafalan santri"));
    }
  },

  // 5. Riwayat Setoran Santri
  async getSetoran(page: number = 1, limit: number = 20): Promise<PortalSetoranResponse> {
    try {
      const response = await portalClient.get<
        GlobalResponse<PortalSetoranRecord[]> & { pagination?: PortalPagination }
      >("/portal/setoran", {
        params: { page, limit },
      });
      return {
        data: response.data.data || [],
        pagination: response.data.pagination || {
          total: response.data.data?.length || 0,
          page,
          limit,
          total_pages: Math.max(1, Math.ceil((response.data.data?.length || 0) / limit)),
        },
      };
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memuat riwayat setoran santri"));
    }
  },

  // 6. Riwayat Absensi Santri
  async getAbsensi(page: number = 1, limit: number = 30): Promise<PortalAbsensiResponse> {
    try {
      const response = await portalClient.get<
        GlobalResponse<{
          data: PortalAbsensiRecord[];
          summary: PortalAbsensiSummary;
        }> & { pagination?: PortalPagination }
      >("/portal/absensi", {
        params: { page, limit },
      });
      return {
        data: response.data.data?.data || [],
        summary: response.data.data?.summary || {
          hadir: 0,
          izin: 0,
          sakit: 0,
          alfa: 0,
          total: 0,
        },
        pagination: response.data.pagination || {
          total: response.data.data?.data?.length || 0,
          page,
          limit,
          total_pages: Math.max(1, Math.ceil((response.data.data?.data?.length || 0) / limit)),
        },
      };
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memuat riwayat absensi santri"));
    }
  },

  // 7. Hasil Ujian Santri
  async getUjian(): Promise<PortalUjianRecord[]> {
    try {
      const response = await portalClient.get<GlobalResponse<PortalUjianRecord[]>>(
        "/portal/ujian"
      );
      return response.data.data || [];
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, "Gagal memuat hasil ujian santri"));
    }
  },
};
