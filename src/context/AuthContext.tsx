import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { type LoginFormValues } from "@/utils/zodSchema";
import { authService } from "@/services/authService";

export type Role = "superadmin" | "muhafiz";

interface User {
  id_user: number;
  email: string;
  role: Role;
  username: string;
  token?: string;
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

  const initializeTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    }
  };

  const refreshUser = useCallback(async () => {
    const savedData = localStorage.getItem("user");
    
    if (!savedData) {
      setIsLoading(false);
      return;
    }

    try {
      // Parse data dari localStorage untuk cek token
      const parsedData = JSON.parse(savedData);
      if (!parsedData.token) {
        logout();
        return;
      }

      // Coba ambil data user dari endpoint /auth/me
      try {
        const response = await authService.getCurrentUser();
        const userData = response.data.user;
        
        // Gabungkan dengan token dari localStorage
        const fullUser: User = {
          ...userData,
          token: parsedData.token,
          username: userData.username || "User"
        };

        setUser(fullUser);
        localStorage.setItem("user", JSON.stringify(fullUser));
      } catch (error) {
        console.error("Failed to fetch user from API:", error);
        // Jika gagal fetch user, tetap set user dari localStorage
        setUser(parsedData);
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await authService.login(values);
      
      const userData: User = {
        ...response.data.user,
        token: response.data.token,
        username: response.data.user.username || "User"
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    setIsLoading(false);
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

  useEffect(() => {
    initializeTheme();
    refreshUser();
  }, []); 

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