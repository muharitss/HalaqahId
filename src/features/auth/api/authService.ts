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
  }
};
