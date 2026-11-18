import axios, { type AxiosRequestConfig } from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// In-memory access token storage (K6: never persist tokens or superadmin_session in localStorage)
let inMemoryAccessToken: string | null = null;

export function setInMemoryAccessToken(token: string | null) {
  inMemoryAccessToken = token;
  // Purge any legacy tokens from localStorage immediately
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("halaqah_refresh");
    localStorage.removeItem("superadmin_session");
  } catch {}
}

export function getInMemoryAccessToken(): string | null {
  if (inMemoryAccessToken) return inMemoryAccessToken;
  // Migrate any legacy/test-injected token from localStorage into memory and remove from storage
  try {
    const legacyToken = localStorage.getItem("token");
    if (legacyToken) {
      inMemoryAccessToken = legacyToken;
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("halaqah_refresh");
      localStorage.removeItem("superadmin_session");
      return inMemoryAccessToken;
    }
  } catch {}
  return null;
}

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

export function clearAuthData() {
  inMemoryAccessToken = null;
  try {
    localStorage.removeItem("user");
    localStorage.removeItem("superadmin_session");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("halaqah_refresh");
    sessionStorage.clear();
  } catch {}
}

// Request interceptor untuk menambahkan token dan header tenant
axiosClient.interceptors.request.use(
  (config) => {
    const tenantSlug = resolveTenantSlug();
    if (tenantSlug) {
      config.headers["x-tenant-slug"] = tenantSlug;
    }

    const displayToken = sessionStorage.getItem("display_token") || localStorage.getItem("display_token");
    if (displayToken && config.url?.includes("/display/") && !config.headers["x-display-token"]) {
      config.headers["x-display-token"] = displayToken;
    }

    const token = getInMemoryAccessToken();
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

// Response interceptor untuk handle token refresh via HttpOnly cookie dan 401 error
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
          {},
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        const newAccessToken =
          refreshResponse.data?.data?.token || refreshResponse.data?.token;

        if (!newAccessToken) {
          throw new Error("Token baru tidak ditemukan di response refresh");
        }

        setInMemoryAccessToken(newAccessToken);
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
