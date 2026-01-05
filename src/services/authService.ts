// import axiosClient from "@/api/axiosClient";
import { type LoginFormValues } from "@/utils/zodSchema";

// Interface respons dari backend (disesuaikan dengan skema Prisma)
export interface AuthResponse {
  user: {
    id_user: number;
    email: string;
    role: "kepala_musyrif" | "muhafidz";
    is_active: boolean;
  };
  token: string;
}

export const authService = {
  login: async (credentials: LoginFormValues): Promise<AuthResponse> => {
    // KETIKA BACKEND SIAP, GUNAKAN INI:
    // const response = await axiosClient.post<AuthResponse>("/auth/login", credentials);
    // return response.data;

    // SEKARANG (MOCK VERSION):
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (credentials.password === "password123") {
      return {
        user: {
          id_user: 1,
          email: credentials.email,
          role: credentials.email === "kepala@test.com" ? "kepala_musyrif" : "muhafidz",
          is_active: true,
        },
        token: "mock-jwt-token",
      };
    }
    
    throw new Error("Invalid credentials");
  },

  logout: () => {
    localStorage.removeItem("user");
  }
};