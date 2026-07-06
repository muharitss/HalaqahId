import axiosClient from "@/lib/axiosClient";
import { type LoginFormValues, type RegisterFormValues } from "@/features/auth/types/auth.schema";
import { type AuthResponse } from "@/types/domain/auth";

export const authService = {
  login: async (credentials: LoginFormValues): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>("/halaqah/auth/login", credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    const response = await axiosClient.get<AuthResponse>("/halaqah/auth/me");
    return response.data;
  },

  registerAdmin: async (data: Omit<RegisterFormValues, "confirmPassword">) => {
    const response = await axiosClient.post("/halaqah/auth/register-admin", data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("user");
  },

  verifyEmail: async (token: string) => {
    const response = await axiosClient.get(`/halaqah/auth/verify-email?token=${token}`);
    return response.data;
  },

  resendVerification: async (email: string) => {
    const response = await axiosClient.post("/halaqah/auth/resend-verification", { email });
    return response.data;
  },

  // ── Superadmin User Management APIs ──
  
  getAllUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    id_sekolah?: number;
  }) => {
    const response = await axiosClient.get("/halaqah/auth/users", { params });
    return response.data;
  },

  verifyUser: async (id: number) => {
    const response = await axiosClient.patch(`/halaqah/auth/users/${id}/verify`);
    return response.data;
  },

  resetPassword: async (id: number, data: { password: string }) => {
    const response = await axiosClient.patch(`/halaqah/auth/users/${id}/password`, data);
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await axiosClient.delete(`/halaqah/auth/users/${id}`);
    return response.data;
  },

  impersonateUser: async (id: number): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>(`/halaqah/auth/impersonate/${id}`);
    return response.data;
  },

  getAuditLogs: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    action?: string;
    id_sekolah?: number;
  }) => {
    const response = await axiosClient.get("/audit-logs", { params });
    return response.data;
  },

  stopImpersonateUser: async (data: { targetUserId: number }) => {
    const response = await axiosClient.post("/halaqah/auth/impersonate-stop", data);
    return response.data;
  }
};

