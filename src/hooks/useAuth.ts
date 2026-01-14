import { useState, useCallback, useEffect } from "react";
import axiosClient from "@/api/axiosClient";

interface User {
  id_user: number;
  username: string;
  email: string;
  role: "ADMIN" | "MUHAFIZ";
  halaqah_id?: number;
  halaqah_nama?: string;
  token: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: "ADMIN" | "MUHAFIZ";
  halaqah_id?: number;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUserFromStorage = () => {
      const savedData = localStorage.getItem("user");
      if (savedData) {
        try {
          const userData = JSON.parse(savedData);
          setUser(userData);
        } catch (err) {
          console.error("Failed to parse user data from localStorage", err);
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false);
    };

    loadUserFromStorage();
  }, []);

  // Login
  const login = useCallback(async (data: LoginData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosClient.post("/auth/login", data);
      const userData = response.data.data;
      
      // Save to state and localStorage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      return userData;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login gagal";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
  }, []);

  // Register (Admin only)
  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosClient.post("/auth/register", data);
      return response.data.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Registrasi gagal";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (data: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosClient.patch("/auth/profile", data);
      const updatedUser = response.data.data;
      
      // Update state and localStorage
      setUser(prev => prev ? { ...prev, ...updatedUser } : null);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Gagal memperbarui profil";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return !!user;
  }, [user]);

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return user?.role === "ADMIN";
  }, [user]);

  // Check if user is muhafiz
  const isMuhafiz = useCallback(() => {
    return user?.role === "MUHAFIZ";
  }, [user]);

  // Reset error
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    user,
    isLoading,
    error,
    
    // Actions
    login,
    logout,
    register,
    updateProfile,
    resetError,
    
    // Helper functions
    isAuthenticated,
    isAdmin,
    isMuhafiz,
    
    // Convenience getters
    userId: user?.id_user,
    userRole: user?.role,
    userHalaqahId: user?.halaqah_id,
  };
};