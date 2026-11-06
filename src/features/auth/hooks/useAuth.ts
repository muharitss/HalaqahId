import { useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";
import type { AuthContextType } from "@/types/domain/auth";

export const useAuth = (): AuthContextType => {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isImpersonating = useAuthStore((s) => s.isImpersonating);
  const sekolahList = useAuthStore((s) => s.sekolahList);
  const activeSekolah = useAuthStore((s) => s.activeSekolah);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const impersonate = useAuthStore((s) => s.impersonate);
  const stopImpersonating = useAuthStore((s) => s.stopImpersonating);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const isKepala = useAuthStore((s) => s.isKepala);
  const switchSekolah = useAuthStore((s) => s.switchSekolah);
  const fetchUserSchools = useAuthStore((s) => s.fetchUserSchools);

  return useMemo(
    () => ({
      user,
      permissions: user?.permissions ?? [],
      roles: user?.roles ?? (user?.role ? [user.role] : []),
      sekolahList,
      activeSekolah,
      isLoading,
      isImpersonating,
      login,
      logout,
      refreshUser,
      impersonate,
      stopImpersonating,
      isAdmin,
      isKepala,
      switchSekolah,
      fetchUserSchools,
      isDarkMode: useThemeStore.getState().theme === "dark",
      toggleDarkMode: () => {
        const currentTheme = useThemeStore.getState().theme;
        useThemeStore.getState().setTheme(currentTheme === "dark" ? "light" : "dark");
      },
    }),
    [
      user,
      sekolahList,
      activeSekolah,
      isLoading,
      isImpersonating,
      login,
      logout,
      refreshUser,
      impersonate,
      stopImpersonating,
      isAdmin,
      isKepala,
      switchSekolah,
      fetchUserSchools,
    ]
  );
};
