import axios from "axios";
import { getTenantSlugFromUrl } from "@/utils/tenant";

const axiosClient = axios.create({
  baseURL: import.meta.env?.VITE_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor untuk menambahkan token dan tenant context dari berbagai sumber
axiosClient.interceptors.request.use(
  (config) => {
    // Tambahkan X-Tenant-Slug dari context/url
    const tenantSlug = getTenantSlugFromUrl();
    if (tenantSlug) {
      config.headers["X-Tenant-Slug"] = tenantSlug;
    }

    // Coba ambil token dari localStorage dengan berbagai cara
    let token = null;
    
    // Cara 1: Dari user object
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        token = user.token;
      } catch (e) {
        console.error("Gagal parse user:", e);
      }
    }
    
    // Cara 2: Dari token langsung (jika ada)
    if (!token) {
      token = localStorage.getItem("token");
    }
    
    // Cara 3: Dari superadmin session (untuk impersonate)
    if (!token) {
      const superadminStr = localStorage.getItem("superadmin_session");
      if (superadminStr) {
        try {
          const superadmin = JSON.parse(superadminStr);
          token = superadmin.token;
        } catch (e) {
          console.error("Gagal parse superadmin:", e);
        }
      }
    }
    
    // Jika token ditemukan, tambahkan ke header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token added to request:", config.url);
    } else {
      console.warn("No token found for request:", config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error);
    } else if (token) {
      item.resolve(token);
    }
  });
  failedQueue = [];
};

const performLogout = () => {
  const superadminStr = localStorage.getItem("superadmin_session");
  if (superadminStr) {
    try {
      const superadmin = JSON.parse(superadminStr);
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...superadmin,
          isImpersonating: false,
        })
      );
      localStorage.removeItem("superadmin_session");
      window.location.href = "/login?reason=session_expired";
      return;
    } catch (e) {
      console.error("Gagal restore session:", e);
    }
  }

  localStorage.removeItem("user");
  localStorage.removeItem("superadmin_session");
  localStorage.removeItem("token");
  sessionStorage.clear();
  window.location.href = "/login?reason=session_expired";
};

// Response interceptor untuk handle error & refresh token
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as (typeof error.config & { _retry?: boolean }) | undefined;

    if (error.response?.status === 401) {
      const pathname = window.location.pathname;
      const isPublicPage =
        pathname === "/login" ||
        pathname.startsWith("/login/") ||
        pathname === "/register" ||
        pathname.startsWith("/register/") ||
        pathname === "/verify-email" ||
        pathname.startsWith("/verify-email/") ||
        pathname === "/forgot-password" ||
        pathname.startsWith("/forgot-password/") ||
        pathname === "/reset-password" ||
        pathname.startsWith("/reset-password/");

      const isAuthBypassRequest =
        originalRequest?.url?.includes("/login") ||
        originalRequest?.url?.includes("/forgot-password") ||
        originalRequest?.url?.includes("/reset-password") ||
        originalRequest?.url?.includes("/refresh");

      if (isAuthBypassRequest || isPublicPage) {
        return Promise.reject(error);
      }

      const userStr = localStorage.getItem("user");
      let refreshToken: string | null = null;
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          refreshToken = user?.refresh_token || null;
        } catch (e) {
          console.error("Gagal membaca refresh token dari storage:", e);
        }
      }

      if (!refreshToken || originalRequest?._retry) {
        performLogout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axiosClient(originalRequest);
            }
            return Promise.reject(error);
          })
          .catch((err) => Promise.reject(err));
      }

      if (originalRequest) {
        originalRequest._retry = true;
      }
      isRefreshing = true;

      try {
        const refreshResponse = await axiosClient.post<{
          success: boolean;
          message: string;
          data: { token: string; refresh_token: string };
        }>("/halaqah/auth/refresh", { refresh_token: refreshToken });

        const newToken = refreshResponse.data.data.token;
        const newRefreshToken = refreshResponse.data.data.refresh_token;

        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            localStorage.setItem(
              "user",
              JSON.stringify({
                ...user,
                token: newToken,
                refresh_token: newRefreshToken,
              })
            );
          } catch {
            // ignore
          }
        }

        if (localStorage.getItem("token")) {
          localStorage.setItem("token", newToken);
        }

        axiosClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);

        if (originalRequest) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosClient(originalRequest);
        }
      } catch (refreshErr: unknown) {
        processQueue(refreshErr, null);
        performLogout();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

