import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor untuk menambahkan token dari berbagai sumber
axiosClient.interceptors.request.use(
  (config) => {
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

// Response interceptor untuk handle error
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized access - token mungkin expired");
      
      // Cek apakah ini karena impersonate session
      const superadminStr = localStorage.getItem("superadmin_session");
      if (superadminStr) {
        // Jika ada superadmin session, coba restore
        try {
          const superadmin = JSON.parse(superadminStr);
          // Set user back to superadmin
          localStorage.setItem("user", JSON.stringify({
            ...superadmin,
            isImpersonating: false
          }));
          // Hapus session impersonate
          localStorage.removeItem("superadmin_session");
          
          // Redirect ke halaman login dengan pesan
          window.location.href = "/login?reason=session_expired";
        } catch (error) {
          // Jika gagal, logout semua
          localStorage.clear();
          window.location.href = "/login";
          console.error("Gagal restore session:", error);
        }
      } else {
        // Tidak ada superadmin session, logout biasa
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
