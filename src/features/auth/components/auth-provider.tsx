// FILE: ./context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { type LoginFormValues } from "@/features/auth/types/auth.schema";
import { authService } from "@/features/auth/api/authService";
import { Role, isKepalaRole } from "@/types/domain/enums";
import { type AuthUser, type AuthContextType } from "@/types/domain/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Helper untuk simpan user ke localStorage
  const saveUserToStorage = (userData: AuthUser | null) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  };

  // NEW: Helper untuk simpan superadmin session
  const saveSuperadminSession = (superadminData: AuthUser) => {
    if (isKepalaRole(superadminData.role)) {
      localStorage.setItem("superadmin_session", JSON.stringify({
        id_user: superadminData.id_user,
        token: superadminData.token,
        name: superadminData.name,
        email: superadminData.email,
        role: superadminData.role
      }));
    }
  };

  // NEW: Function untuk impersonate
  const impersonate = async (impersonatedUser: AuthUser, originalUser: AuthUser) => {
    const userData: AuthUser = {
      ...impersonatedUser,
      isImpersonating: true,
      originalUser: {
        id_user: originalUser.id_user,
        role: originalUser.role,
        name: originalUser.name,
        token: originalUser.token!
      }
    };

    setUser(userData);
    saveUserToStorage(userData);
    
    // Simpan session superadmin di storage terpisah
    if (isKepalaRole(originalUser.role)) {
      localStorage.setItem("superadmin_session", JSON.stringify({
        id_user: originalUser.id_user,
        token: originalUser.token,
        name: originalUser.name,
        email: originalUser.email,
        role: originalUser.role
      }));
    }
  };

  // Function untuk kembali ke superadmin
  const stopImpersonating = async () => {
    const superadminSession = localStorage.getItem("superadmin_session");
    
    if (superadminSession) {
      try {
        const sessionData = JSON.parse(superadminSession);
        
        const originalRole = sessionData.role || user?.originalUser?.role || Role.SUPERADMIN;
        
        // Set user kembali ke admin asal
        const superadminUser: AuthUser = {
          ...sessionData,
          role: originalRole,
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
      const parsedData = JSON.parse(savedData) as AuthUser;
      
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

        const fullUser: AuthUser = {
          ...userData,
          token: parsedData.token,
          name: userData.name || "User"
        };  

        setUser(fullUser);
        saveUserToStorage(fullUser);
        
        if (isKepalaRole(userData?.role)) {
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
    const response = await authService.login(values);
    
    if (!response.success) {
      throw new Error(response.message || "Login gagal");
    }
    
    const userData: AuthUser = {
      ...response.data.user,
      token: response.data.token,
      name: response.data.user.name || "User",
      isImpersonating: false
    };

    setUser(userData);
    saveUserToStorage(userData);
    
    if (isKepalaRole(userData.role)) {
      saveSuperadminSession(userData);
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
    return user?.role === Role.SUPERADMIN;
  }, [user])

  const isKepala = useCallback(() => {
    return user ? isKepalaRole(user.role) : false;
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
      isKepala,
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
