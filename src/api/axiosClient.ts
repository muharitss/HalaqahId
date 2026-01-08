import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://halaqahid-backend.vercel.app/api/halaqah",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, 
});

// REQUEST INTERCEPTOR
axiosClient.interceptors.request.use((config) => {
  const savedData = localStorage.getItem("user");
  if (savedData) {
    try {
      const { token } = JSON.parse(savedData);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error("Gagal parse data user dari localStorage", e);
    }
  }
  return config;
});

// RESPONSE INTERCEPTOR
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    const isLoginRequest = error.config?.url?.includes('/login');
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !isLoginRequest && !originalRequest._retry) {
      // Tandai request sudah di-retry
      originalRequest._retry = true;
      
      // Coba refresh token jika ada mekanisme refresh token
      // Untuk sekarang, cukup logout jika 401
      if (localStorage.getItem("user")) {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    
    // Log error untuk debugging
    console.error("API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    });
    
    return Promise.reject(error);
  }
);

export default axiosClient;