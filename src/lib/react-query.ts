import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      // Diturunkan dari 5 menit ke 1 menit sebagai defence-in-depth:
      // data user-sensitif tidak boleh di-cache terlalu lama antar sesi
      staleTime: 1 * 60 * 1000, // 1 minute
    },
  },
});
