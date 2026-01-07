import axiosClient from "@/api/axiosClient";
import { type LoginFormValues } from "@/utils/zodSchema";

// Interface respons dari backend (disesuaikan dengan skema Prisma)
export interface AuthResponse {
  success: boolean;
  message: string;
  data: { 
    user: {
      id_user: number;
      email: string;
      role: "superadmin" | "muhafiz";
      nama?: string;
    };
    token: string;
  };
}

export const authService = {
  login: async (credentials: LoginFormValues): Promise<AuthResponse> => {
    // Endpoint: /auth/login
    const response = await axiosClient.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    // Endpoint: /auth/me
    const response = await axiosClient.get<AuthResponse>("/auth/me");
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("user");
  }
};