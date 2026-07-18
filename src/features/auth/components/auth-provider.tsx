import React from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const authState = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  return {
    ...authState,
    isDarkMode: theme === "dark",
    toggleDarkMode: () => setTheme(theme === "dark" ? "light" : "dark"),
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
export default AuthProvider;
