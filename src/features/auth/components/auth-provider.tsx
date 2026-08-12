import React, { useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isImpersonating = useAuthStore((s) => s.isImpersonating);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const impersonate = useAuthStore((s) => s.impersonate);
  const stopImpersonating = useAuthStore((s) => s.stopImpersonating);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const isKepala = useAuthStore((s) => s.isKepala);

  return useMemo(
    () => ({
      user,
      isLoading,
      isImpersonating,
      login,
      logout,
      refreshUser,
      impersonate,
      stopImpersonating,
      isAdmin,
      isKepala,
      isDarkMode: useThemeStore.getState().theme === "dark",
      toggleDarkMode: () => {
        const currentTheme = useThemeStore.getState().theme;
        useThemeStore.getState().setTheme(currentTheme === "dark" ? "light" : "dark");
      },
    }),
    [user, isLoading, isImpersonating, login, logout, refreshUser, impersonate, stopImpersonating, isAdmin, isKepala]
  );
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
export default AuthProvider;
