import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api-v1/api/halaqah", //|| "https://halaqahid-backend.vercel.app/api/halaqah",
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. REQUEST INTERCEPTOR: Mengirim Token di setiap request
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

// 2. RESPONSE INTERCEPTOR: Menangkap kalau token mati (Anti-Jebol)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;