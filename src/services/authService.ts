import axiosClient from "@/api/axiosClient";
import { type LoginFormValues } from "@/utils/zodSchema";

export interface AuthResponse {
  success: boolean;
  message: string;
  data: { 
    user: {
      id_user: number;
      email: string;
      username: string;
      role: "superadmin" | "muhafiz";
    };
    token: string;
  };
}

export const authService = {
  login: async (credentials: LoginFormValues): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>("/halaqah/auth/login", credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    const response = await axiosClient.get<AuthResponse>("/halaqah/auth/me");
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("user");
  }
};