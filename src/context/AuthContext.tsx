import React, { createContext, useContext, useState, useEffect } from "react";
import { type LoginFormValues } from "@/utils/zodSchema";

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};