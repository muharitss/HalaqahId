import React, { createContext, useContext, useState, useEffect } from "react";
import { type LoginFormValues } from "@/utils/zodSchema";
// import { authService, type AuthResponse } from "@/services/authService"; ini digunakan ketika ada api

// Sesuaikan dengan Enum di Prisma
export type Role = "kepala_muhafidz" | "muhafidz";

interface User {
  id: number;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Simulasi cek session saat pertama kali load
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = async (values: LoginFormValues) => {
    setIsLoading(true);
    
    // Simulasi Delay API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // MOCK LOGIC: Berdasarkan email untuk testing role
    let mockUser: User;
    
    if (values.email === "kepala@test.com") {
      mockUser = { id: 1, email: values.email, role: "kepala_muhafidz", nama: "Ustadz Admin" };
    } else {
      mockUser = { id: 2, email: values.email, role: "muhafidz", nama: "Ustadz Pembimbing" };
    }

    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
    setIsLoading(false);
  };

  // ketika Backend siap kita akan menggunakan ini:

// const login = async (values: LoginFormValues) => {
//   setIsLoading(true);
//   try {
//     const data = await authService.login(values);
//     setUser(data.user);
//     localStorage.setItem("user", JSON.stringify(data));
//   } catch (error) {
//     throw error;
//   } finally {
//     setIsLoading(false);
//   }
// };

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
      toggleDarkMode 
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