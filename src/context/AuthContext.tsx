// FILE: ./context/AuthContext.tsx
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
  avatarUrl?: string;
  isImpersonating?: boolean; 
  originalUser?: { 
    id_user: number;
    role: Role;
    username: string;
    token: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (values: LoginFormValues) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  refreshUser: () => Promise<void>;
  impersonate: (userData: User, originalUser: User) => Promise<void>;
  stopImpersonating: () => Promise<void>;
  isImpersonating: boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Helper untuk simpan user ke localStorage
  const saveUserToStorage = (userData: User | null) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  };

  // NEW: Helper untuk simpan superadmin session
  const saveSuperadminSession = (superadminData: User) => {
    if (superadminData.role === "superadmin") {
      localStorage.setItem("superadmin_session", JSON.stringify({
        id_user: superadminData.id_user,
        token: superadminData.token,
        username: superadminData.username,
        email: superadminData.email
      }));
    }
  };

  // NEW: Function untuk impersonate
  const impersonate = async (impersonatedUser: User, originalUser: User) => {
    const userData: User = {
      ...impersonatedUser,
      isImpersonating: true,
      originalUser: {
        id_user: originalUser.id_user,
        role: originalUser.role,
        username: originalUser.username,
        token: originalUser.token!
      }
    };

    setUser(userData);
    saveUserToStorage(userData);
    
    // Simpan session superadmin di storage terpisah
    if (originalUser.role === "superadmin") {
      localStorage.setItem("superadmin_session", JSON.stringify({
        id_user: originalUser.id_user,
        token: originalUser.token,
        username: originalUser.username,
        email: originalUser.email
      }));
    }
  };

  // Function untuk kembali ke superadmin
  const stopImpersonating = async () => {
    const superadminSession = localStorage.getItem("superadmin_session");
    
    if (superadminSession) {
      try {
        const sessionData = JSON.parse(superadminSession);
        
        // Set user kembali ke superadmin
        const superadminUser: User = {
          ...sessionData,
          role: "superadmin" as Role,
          isImpersonating: false,
          originalUser: undefined
        };

        setUser(superadminUser);
        saveUserToStorage(superadminUser);
        
        // Refresh token untuk memastikan valid
        try {
          const response = await authService.getCurrentUser();
          const updatedUser = {
            ...superadminUser,
            ...response.data.user
          };
          
          setUser(updatedUser);
          saveUserToStorage(updatedUser);
        } catch (error) {
          console.warn("Failed to refresh superadmin token:", error);
          // Tetap lanjut dengan token yang ada
        }
        
      } catch (error) {
        console.error("Failed to restore superadmin session:", error);
        logout();
      }
    } else {
      logout();
    }
  };

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
      const parsedData = JSON.parse(savedData) as User;
      
      // Jika sedang impersonate, langsung set user dari localStorage
      if (parsedData.isImpersonating) {
        setUser(parsedData);
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await authService.getCurrentUser();
        const userData = response.data?.user || response.data;
        
        if (!userData) {
          throw new Error("No user data received from API");
        }

        const fullUser: User = {
          ...userData,
          token: parsedData.token,
          username: userData.username || "User"
        };  

        setUser(fullUser);
        saveUserToStorage(fullUser);
        
        if (userData?.role === "superadmin") {
          saveSuperadminSession(fullUser);
        }
      } catch (error) {
        console.error("Failed to fetch user from API:", error);
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
    try {
      const response = await authService.login(values);
      
      if (!response.success) {
        throw new Error(response.message || "Login gagal");
      }
      
      const userData: User = {
        ...response.data.user,
        token: response.data.token,
        username: response.data.user.username || "User",
        isImpersonating: false
      };

      setUser(userData);
      saveUserToStorage(userData);
      
      if (userData.role === "superadmin") {
        saveSuperadminSession(userData);
      }
      
    } catch (error: any) {
      throw error;
    }
  };

  
  const logout = () => {
    // Hapus semua session
    setUser(null);
    setIsLoading(false);
    localStorage.removeItem("user");
    localStorage.removeItem("superadmin_session");
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

  const isAdmin = useCallback(() => {
    return user?.role === "superadmin";
  }, [user])

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading,
      isDarkMode,
      toggleDarkMode,
      refreshUser,
      impersonate,
      stopImpersonating,
      isAdmin,
      isImpersonating: user?.isImpersonating || false,
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