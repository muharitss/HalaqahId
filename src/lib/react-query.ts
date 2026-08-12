import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: "always",
      retry: 1,
      // 3 menit staleTime: data tersimpan di cache saat navigasi antar tab/halaman tanpa refetch berulang
      staleTime: 3 * 60 * 1000,
      // 10 menit gcTime (garbage collection): data bertahan di memori saat tab tidak aktif
      gcTime: 10 * 60 * 1000,
    },
  },
});
