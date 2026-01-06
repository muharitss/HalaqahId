import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { type LoginFormValues } from "@/utils/zodSchema";
import { authService } from "@/services/authService";

export type Role = "superadmin" | "muhafidz";

interface User {
  id_user: number;
  email: string;
  role: Role;
  nama: string;
}

interface AuthContextType {
  user: User | null;
  login: (values: LoginFormValues) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Gunakan useCallback agar bisa dipanggil di useEffect tanpa re-render loop
  const refreshUser = useCallback(async () => {
    const savedData = localStorage.getItem("user");
    if (!savedData) {
      setIsLoading(false);
      return;
    }

    try {
      if (user) return;

      const response = await authService.getCurrentUser();
      // Dokumentasi: API return { success: true, data: { user: {...} } }
      const userData = response.data.user; 
      const { token } = JSON.parse(savedData);

      const fullData = { ...userData, token };
      setUser(fullData as any);
      localStorage.setItem("user", JSON.stringify(fullData));
    } catch (error) {
      console.error("Session invalid:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // 1. Gabungkan Inisialisasi (Theme & Auth) dalam satu useEffect
  useEffect(() => {
    // Inisialisasi Theme
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    // Inisialisasi Auth
    refreshUser();
  }, [refreshUser]);

  const login = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await authService.login(values);
      
      // Sesuai dokumentasi: response.data.user dan response.data.token
      const userData = {
        ...response.data.user,
        token: response.data.token
      };

      setUser(userData as any);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      throw error; // Biarkan LoginForm yang menangani pesan errornya
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading,
      isDarkMode,
      toggleDarkMode,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};