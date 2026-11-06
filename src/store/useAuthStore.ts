import { create } from "zustand";
import { type LoginFormValues } from "@/features/auth/validation/auth.schema";
import { authService } from "@/features/auth/api/services/authService";
import { Role, isKepalaRole } from "@/types/domain/enums";
import { type AuthUser } from "@/types/domain/auth";
import { type UserSekolahItem } from "@/types/domain/sekolah";
import { sekolahService } from "@/features/sekolah";
import { queryClient } from "@/lib/react-query";
import { toast } from "sonner";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isImpersonating: boolean;
  sekolahList: UserSekolahItem[];
  activeSekolah: UserSekolahItem["sekolah"] | null;
  login: (values: LoginFormValues) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  impersonate: (impersonatedUser: AuthUser, originalUser: AuthUser) => Promise<void>;
  stopImpersonating: () => Promise<void>;
  isAdmin: () => boolean;
  isKepala: () => boolean;
  switchSekolah: (id_sekolah: number) => Promise<void>;
  fetchUserSchools: () => Promise<void>;
}

const extractTenantIdFromToken = (token?: string): number | null => {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const parsed = JSON.parse(jsonPayload);
      return typeof parsed.id_tenant === "number" ? parsed.id_tenant : null;
    }
  } catch {
    // ignore parse error
  }
  return null;
};

const saveUserToStorage = (userData: AuthUser | null) => {
  if (userData) {
    localStorage.setItem("user", JSON.stringify(userData));
  } else {
    localStorage.removeItem("user");
  }
};

const saveSuperadminSession = (superadminData: AuthUser) => {
  if (isKepalaRole(superadminData.role)) {
    localStorage.setItem(
      "superadmin_session",
      JSON.stringify({
        id_user: superadminData.id_user,
        token: superadminData.token,
        name: superadminData.name,
        email: superadminData.email,
        role: superadminData.role,
        roles: superadminData.roles,
        permissions: superadminData.permissions,
        id_tenant: superadminData.id_tenant,
        is_verified: superadminData.is_verified,
      })
    );
  }
};

const getInitialUser = (): AuthUser | null => {
  try {
    const saved = localStorage.getItem("user");
    return saved ? (JSON.parse(saved) as AuthUser) : null;
  } catch {
    return null;
  }
};

const getInitialSekolahList = (): UserSekolahItem[] => {
  try {
    const saved = localStorage.getItem("user_sekolah_list");
    return saved ? (JSON.parse(saved) as UserSekolahItem[]) : [];
  } catch {
    return [];
  }
};

const initialUser = getInitialUser();
const initialSekolahList = getInitialSekolahList();
const initialActiveSekolah =
  initialSekolahList.find((s) => s.id_sekolah === initialUser?.id_sekolah)?.sekolah ||
  initialSekolahList.find((s) => s.is_primary)?.sekolah ||
  (initialSekolahList.length > 0 ? initialSekolahList[0].sekolah : null);

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initialUser,
  isLoading: !initialUser,
  isImpersonating: initialUser?.isImpersonating || false,
  sekolahList: initialSekolahList,
  activeSekolah: initialActiveSekolah,

  isAdmin: () => get().user?.role === Role.SUPERADMIN,
  isKepala: () => (get().user ? isKepalaRole(get().user!.role) : false),

  fetchUserSchools: async () => {
    const currentUser = get().user;
    if (!currentUser?.id_user) return;
    try {
      const response = await sekolahService.getUserSchools(currentUser.id_user);
      const list = response.data || [];
      const active =
        list.find((s) => s.id_sekolah === currentUser.id_sekolah)?.sekolah ||
        list.find((s) => s.is_primary)?.sekolah ||
        (list.length > 0 ? list[0].sekolah : null);
      set({ sekolahList: list, activeSekolah: active });
      localStorage.setItem("user_sekolah_list", JSON.stringify(list));
    } catch (error) {
      console.warn("Gagal memuat daftar sekolah user:", error);
    }
  },

  switchSekolah: async (id_sekolah: number) => {
    const currentUser = get().user;
    if (!currentUser?.id_user) return;
    try {
      const res = await sekolahService.switchUserSchool(currentUser.id_user, id_sekolah);
      const switchedData = res.data;
      const newToken = switchedData?.token || currentUser.token;

      const updatedUser: AuthUser = {
        ...currentUser,
        id_sekolah,
        token: newToken,
      };

      const updatedList = get().sekolahList.map((item) => ({
        ...item,
        is_primary: item.id_sekolah === id_sekolah,
      }));

      const active =
        switchedData?.sekolah ||
        updatedList.find((s) => s.id_sekolah === id_sekolah)?.sekolah ||
        null;

      set({
        user: updatedUser,
        sekolahList: updatedList,
        activeSekolah: active,
      });

      saveUserToStorage(updatedUser);
      localStorage.setItem("user_sekolah_list", JSON.stringify(updatedList));
      if (newToken) {
        localStorage.setItem("token", newToken);
      }

      queryClient.clear();
      toast.success(
        `Berhasil beralih ke ${active?.nama_sekolah || "sekolah terpilih"}`
      );
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Gagal beralih sekolah";
      toast.error(msg);
      throw error;
    }
  },

  login: async (values: LoginFormValues) => {
    const response = await authService.login(values);

    if (!response.success) {
      throw new Error(response.message || "Login gagal");
    }

    queryClient.clear();

    const userPayload = response.data.user;
    const token = response.data.token;
    const tenantIdFromToken = extractTenantIdFromToken(token);

    const userData: AuthUser = {
      ...userPayload,
      id_tenant: userPayload.id_tenant ?? tenantIdFromToken ?? null,
      token: token,
      refresh_token: response.data.refresh_token,
      name: userPayload.name || "User",
      isImpersonating: false,
      roles: userPayload.roles || (userPayload.role ? [userPayload.role] : []),
      permissions: userPayload.permissions || [],
    };

    set({ user: userData, isImpersonating: false });
    saveUserToStorage(userData);

    if (isKepalaRole(userData.role)) {
      saveSuperadminSession(userData);
    }

    await get().fetchUserSchools();
  },

  logout: () => {
    set({
      user: null,
      isLoading: false,
      isImpersonating: false,
      sekolahList: [],
      activeSekolah: null,
    });
    localStorage.removeItem("user");
    localStorage.removeItem("user_sekolah_list");
    localStorage.removeItem("superadmin_session");
    localStorage.removeItem("token");
    sessionStorage.clear();
    queryClient.clear();
  },

  refreshUser: async () => {
    const savedData = localStorage.getItem("user");

    if (!savedData) {
      set({ isLoading: false });
      return;
    }

    try {
      const parsedData = JSON.parse(savedData) as AuthUser;

      // Set initial user state from localStorage immediately to prevent layout thrashing
      set({ user: parsedData, isImpersonating: parsedData.isImpersonating || false });

      try {
        const response = await authService.getCurrentUser();
        const userData = response.data?.user || response.data;

        if (!userData) {
          throw new Error("No user data received from API");
        }

        const fullUser: AuthUser = {
          ...userData,
          id_tenant: userData.id_tenant ?? parsedData.id_tenant ?? extractTenantIdFromToken(parsedData.token) ?? null,
          token: parsedData.token,
          refresh_token: parsedData.refresh_token,
          name: userData.name || "User",
          isImpersonating: parsedData.isImpersonating,
          originalUser: parsedData.originalUser,
          roles: userData.roles || (userData.role ? [userData.role] : parsedData.roles || []),
          permissions: userData.permissions || parsedData.permissions || [],
        };

        set({ user: fullUser, isImpersonating: fullUser.isImpersonating || false });
        saveUserToStorage(fullUser);

        if (isKepalaRole(userData?.role)) {
          saveSuperadminSession(fullUser);
        }

        await get().fetchUserSchools();
      } catch (error: unknown) {
        console.error("Failed to fetch user from API:", error);
        // Clear session if API fetch fails with 401 (token expired/invalid)
        if (typeof error === "object" && error !== null && "response" in error) {
          const resp = (error as { response?: { status?: number } }).response;
          if (resp?.status === 401) {
            get().logout();
          }
        }
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
      get().logout();
    } finally {
      set({ isLoading: false });
    }
  },

  impersonate: async (impersonatedUser: AuthUser, originalUser: AuthUser) => {
    queryClient.clear();

    const userData: AuthUser = {
      ...impersonatedUser,
      id_tenant: impersonatedUser.id_tenant ?? extractTenantIdFromToken(impersonatedUser.token) ?? null,
      isImpersonating: true,
      roles: impersonatedUser.roles || (impersonatedUser.role ? [impersonatedUser.role] : []),
      permissions: impersonatedUser.permissions || [],
      originalUser: {
        id_user: originalUser.id_user,
        role: originalUser.role,
        name: originalUser.name,
        token: originalUser.token!,
        id_tenant: originalUser.id_tenant,
      },
    };

    set({ user: userData, isImpersonating: true });
    saveUserToStorage(userData);

    if (isKepalaRole(originalUser.role)) {
      saveSuperadminSession(originalUser);
    }
  },

  stopImpersonating: async () => {
    const superadminSession = localStorage.getItem("superadmin_session");
    const impersonatedUserId = get().user?.id_user;

    if (superadminSession) {
      try {
        queryClient.clear();

        const sessionData = JSON.parse(superadminSession);
        const originalRole = sessionData.role || get().user?.originalUser?.role || Role.SUPERADMIN;

        const superadminUser: AuthUser = {
          ...sessionData,
          role: originalRole,
          id_tenant: sessionData.id_tenant ?? get().user?.originalUser?.id_tenant ?? null,
          isImpersonating: false,
          originalUser: undefined,
        };

        set({ user: superadminUser, isImpersonating: false });
        saveUserToStorage(superadminUser);

        if (impersonatedUserId) {
          try {
            await authService.stopImpersonateUser({ targetUserId: impersonatedUserId });
          } catch (e) {
            console.error("Gagal mencatat log stop impersonasi di backend:", e);
          }
        }

        try {
          const response = await authService.getCurrentUser();
          const userData = response.data?.user || response.data;
          const updatedUser = {
            ...superadminUser,
            ...userData,
          };

          set({ user: updatedUser, isImpersonating: false });
          saveUserToStorage(updatedUser);
        } catch (error) {
          console.warn("Failed to refresh superadmin token:", error);
        }
      } catch (error) {
        console.error("Failed to restore superadmin session:", error);
        get().logout();
      }
    } else {
      get().logout();
    }
  },
}));
