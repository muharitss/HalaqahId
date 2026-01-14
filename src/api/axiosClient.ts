import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://halaqah-id-be.vercel.app/api",
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
}, (error) => {
  return Promise.reject(error);
});

// RESPONSE INTERCEPTOR
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const serverMessage = error.response?.data?.message || "No message from server";
    console.error("Detail Error dari Backend:", serverMessage);

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