import axiosClient from "@/lib/axiosClient";
import { type LoginFormValues, type RegisterFormValues } from "@/features/auth/validation/auth.schema";
import { 
  type AuthResponse, 
  type RegisterAdminResponse, 
  type VerifyEmailResponse, 
} from "@/types/domain/auth";
import { type GlobalResponse, type GlobalResponseWithPagination } from "@/types/api/response";
import { 
  type AuditLog, 
  type GlobalUser, 
  type AllUsersParams, 
  type AuditLogsParams 
} from "../../types";

export const authService = {
  login: async (credentials: LoginFormValues): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>("/halaqah/auth/login", credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    const response = await axiosClient.get<AuthResponse>("/halaqah/auth/me");
    return response.data;
  },

  registerAdmin: async (
    data: Omit<RegisterFormValues, "confirmPassword">
  ): Promise<GlobalResponse<RegisterAdminResponse>> => {
    const response = await axiosClient.post<GlobalResponse<RegisterAdminResponse>>(
      "/halaqah/auth/register-admin",
      data
    );
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem("user");
    localStorage.removeItem("superadmin_session");
    localStorage.removeItem("token");
    sessionStorage.clear();
  },

  verifyEmail: async (token: string): Promise<GlobalResponse<VerifyEmailResponse>> => {
    const response = await axiosClient.get<GlobalResponse<VerifyEmailResponse>>(
      `/halaqah/auth/verify-email?token=${token}`
    );
    return response.data;
  },

  resendVerification: async (email: string): Promise<GlobalResponse<null>> => {
    const response = await axiosClient.post<GlobalResponse<null>>(
      "/halaqah/auth/resend-verification",
      { email }
    );
    return response.data;
  },

  // ── Superadmin User Management APIs ──
  
  getAllUsers: async (
    params?: AllUsersParams
  ): Promise<GlobalResponseWithPagination<GlobalUser[]>> => {
    const response = await axiosClient.get<GlobalResponseWithPagination<GlobalUser[]>>(
      "/halaqah/auth/users",
      { params }
    );
    return response.data;
  },

  verifyUser: async (id: number): Promise<GlobalResponse<null>> => {
    const response = await axiosClient.patch<GlobalResponse<null>>(
      `/halaqah/auth/users/${id}/verify`
    );
    return response.data;
  },

  resetPassword: async (
    id: number,
    data: { password: string }
  ): Promise<GlobalResponse<null>> => {
    const response = await axiosClient.patch<GlobalResponse<null>>(
      `/halaqah/auth/users/${id}/password`,
      data
    );
    return response.data;
  },

  deleteUser: async (id: number): Promise<GlobalResponse<null>> => {
    const response = await axiosClient.delete<GlobalResponse<null>>(
      `/halaqah/auth/users/${id}`
    );
    return response.data;
  },

  impersonateUser: async (id: number): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>(`/halaqah/auth/impersonate/${id}`);
    return response.data;
  },

  getAuditLogs: async (
    params?: AuditLogsParams
  ): Promise<GlobalResponseWithPagination<AuditLog[]>> => {
    const response = await axiosClient.get<GlobalResponseWithPagination<AuditLog[]>>(
      "/audit-logs",
      { params }
    );
    return response.data;
  },

  stopImpersonateUser: async (data: { targetUserId: number }): Promise<GlobalResponse<null>> => {
    const response = await axiosClient.post<GlobalResponse<null>>(
      "/halaqah/auth/impersonate-stop",
      data
    );
    return response.data;
  }
};
