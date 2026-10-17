import axios, { type AxiosRequestConfig } from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper untuk deteksi tenant slug dari URL / host jika belum tersimpan
function resolveTenantSlug(): string {
  try {
    const stored = localStorage.getItem("tenant_slug");
    if (stored) return stored;

    const hostname = window.location.hostname;
    const parts = hostname.split(".");
    if (parts.length > 2) {
      const subdomain = parts[0];
      if (subdomain !== "www" && subdomain !== "app" && subdomain !== "admin") {
        return subdomain;
      }
    }
  } catch {}
  return (import.meta.env.VITE_DEFAULT_TENANT_SLUG as string) || "default";
}

function clearAuthData() {
  localStorage.removeItem("user");
  localStorage.removeItem("superadmin_session");
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  sessionStorage.clear();
}

// Request interceptor untuk menambahkan token dan header tenant
axiosClient.interceptors.request.use(
  (config) => {
    // 1. Tambahkan header tenant
    const tenantSlug = resolveTenantSlug();
    if (tenantSlug) {
      config.headers["x-tenant-slug"] = tenantSlug;
    }

    // 2. Ambil token dari localStorage
    let token: string | null = null;
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        token = user.token;
      } catch (e) {
        console.error("Gagal parse user:", e);
      }
    }

    if (!token) {
      token = localStorage.getItem("token");
    }

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

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Single-flight refresh token queue
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor untuk handle token refresh dan 401 error
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const pathname = window.location.pathname;
      const isPublicPage =
        pathname === "/login" ||
        pathname.startsWith("/login/") ||
        pathname === "/register" ||
        pathname.startsWith("/register/") ||
        pathname === "/verify-email" ||
        pathname.startsWith("/verify-email/");

      const isAuthAction =
        originalRequest.url?.includes("/login") ||
        originalRequest.url?.includes("/refresh") ||
        originalRequest.url?.includes("/register");

      if (isAuthAction || isPublicPage) {
        return Promise.reject(error);
      }

      // Ambil refresh token
      let refreshToken: string | null = null;
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        refreshToken = user.refresh_token || localStorage.getItem("refresh_token");
      } catch {}

      if (!refreshToken) {
        clearAuthData();
        window.location.href = "/login?reason=session_expired";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
            }
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${axiosClient.defaults.baseURL}/halaqah/auth/refresh`,
          { refresh_token: refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const newAccessToken =
          refreshResponse.data?.data?.token || refreshResponse.data?.token;
        const newRefreshToken =
          refreshResponse.data?.data?.refresh_token || refreshResponse.data?.refresh_token;

        if (!newAccessToken) {
          throw new Error("Token baru tidak ditemukan di response refresh");
        }

        // Simpan token baru
        const userStr = localStorage.getItem("user");
        if (userStr) {
          try {
            const userObj = JSON.parse(userStr);
            userObj.token = newAccessToken;
            if (newRefreshToken) userObj.refresh_token = newRefreshToken;
            localStorage.setItem("user", JSON.stringify(userObj));
          } catch {}
        }
        localStorage.setItem("token", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refresh_token", newRefreshToken);
        }

        processQueue(null, newAccessToken);
        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }
        return axiosClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        clearAuthData();
        window.location.href = "/login?reason=session_expired";
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
