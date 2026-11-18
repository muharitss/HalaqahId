import { create } from "zustand";
import { type LoginFormValues } from "@/features/auth/validation/auth.schema";
import { authService } from "@/features/auth/api/services/authService";
import { Role, isKepalaRole } from "@/types/domain/enums";
import { type AuthUser } from "@/types/domain/auth";
import { queryClient } from "@/lib/react-query";
import {
  clearAuthData,
  getInMemoryAccessToken,
  setInMemoryAccessToken,
} from "@/lib/axiosClient";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isImpersonating: boolean;
  login: (values: LoginFormValues) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  impersonate: (impersonatedUser: AuthUser, originalUser: AuthUser) => Promise<void>;
  stopImpersonating: () => Promise<void>;
  isAdmin: () => boolean;
  isKepala: () => boolean;
}

const purgeLegacyTokenStorage = () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("halaqah_refresh");
    localStorage.removeItem("superadmin_session");
    const userRaw = localStorage.getItem("user");
    if (userRaw) {
      const parsed = JSON.parse(userRaw);
      if (parsed && (parsed.token || parsed.refresh_token || parsed.originalUser)) {
        delete parsed.token;
        delete parsed.refresh_token;
        delete parsed.originalUser;
        localStorage.setItem("user", JSON.stringify(parsed));
      }
    }
  } catch {}
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isImpersonating: false,

  isAdmin: () => get().user?.role === Role.SUPERADMIN,
  isKepala: () => (get().user ? isKepalaRole(get().user!.role) : false),

  login: async (values: LoginFormValues) => {
    const response = await authService.login(values);

    if (!response.success) {
      throw new Error(response.message || "Login gagal");
    }

    queryClient.clear();
    setInMemoryAccessToken(response.data.token);
    purgeLegacyTokenStorage();

    const userData: AuthUser = {
      ...response.data.user,
      name: response.data.user.name || "User",
      isImpersonating: false,
    };

    set({ user: userData, isImpersonating: false });
  },

  logout: () => {
    set({ user: null, isLoading: false, isImpersonating: false });
    clearAuthData();
    queryClient.clear();
  },

  refreshUser: async () => {
    purgeLegacyTokenStorage();

    try {
      let activeToken = getInMemoryAccessToken();

      if (!activeToken) {
        try {
          const refreshRes = await authService.refreshSession();
          const refreshedToken = refreshRes?.data?.token || (refreshRes as any)?.token;
          if (refreshedToken) {
            setInMemoryAccessToken(refreshedToken);
            activeToken = refreshedToken;
          }
        } catch {
          // Silent refresh failed (no active cookie session)
        }
      }

      if (!activeToken) {
        set({ user: null, isLoading: false });
        return;
      }

      const response = await authService.getCurrentUser();
      const userData = response.data?.user || response.data;

      if (!userData) {
        throw new Error("No user data received from API");
      }

      const fullUser: AuthUser = {
        ...userData,
        name: userData.name || "User",
        isImpersonating: Boolean(get().isImpersonating),
      };

      set({ user: fullUser, isImpersonating: Boolean(fullUser.isImpersonating) });
      purgeLegacyTokenStorage();
    } catch (error: any) {
      if (error?.response?.status === 401) {
        get().logout();
      } else {
        set({ user: null, isImpersonating: false });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  impersonate: async (impersonatedUser: AuthUser, _originalUser: AuthUser) => {
    queryClient.clear();

    if (impersonatedUser.token) {
      setInMemoryAccessToken(impersonatedUser.token);
    }
    purgeLegacyTokenStorage();

    const userData: AuthUser = {
      ...impersonatedUser,
      token: undefined,
      refresh_token: undefined,
      isImpersonating: true,
    };

    set({ user: userData, isImpersonating: true });
  },

  stopImpersonating: async () => {
    const impersonatedUserId = get().user?.id_user;

    try {
      queryClient.clear();

      if (impersonatedUserId) {
        const res = await authService.stopImpersonateUser({ targetUserId: impersonatedUserId });
        const restored = (res as any)?.data;
        if (restored?.token) {
          setInMemoryAccessToken(restored.token);
        }
        if (restored?.user) {
          set({
            user: {
              ...restored.user,
              isImpersonating: false,
            },
            isImpersonating: false,
          });
          purgeLegacyTokenStorage();
          return;
        }
      }

      await get().refreshUser();
      set({ isImpersonating: false });
    } catch {
      get().logout();
    }
  },
}));
