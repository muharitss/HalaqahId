import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://halaqahid-be.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

axiosClient.interceptors.request.use(
  (config) => {
    const savedData = localStorage.getItem("user");
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        const token = parsedData?.token;
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error("Axios: Gagal parse data user", e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    const serverMessage = response?.data?.message || "Terjadi kesalahan pada server";

    // LOGIKA KHUSUS STATUS CODE
    if (response) {
      switch (response.status) {
        case 401:
          console.warn("Unauthorized: Token mungkin expired");
          break;
          
        case 403:
          console.error("Forbidden: Anda tidak punya akses ke fitur ini");
          break;
          
        case 404:
          console.error("Not Found: Endpoint atau data tidak ditemukan");
          break;
          
        case 500:
          console.error("Server Error: Masalah pada internal backend");
          break;
      }
    } else {
      console.error("Network Error: Pastikan internet aktif atau server berjalan");
    }

    return Promise.reject({
      message: serverMessage,
      status: response?.status,
      originalError: error
    });
  }
);

export const displayApi = axios.create({
  baseURL: "https://halaqah-id-be.vercel.app/api/display",
  headers: { "Content-Type": "application/json" }
});

export default axiosClient;