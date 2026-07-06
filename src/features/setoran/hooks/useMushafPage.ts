/**
 * useMushafPage.ts
 * React Query hook untuk mengambil data halaman mushaf dari UmmahAPI.
 *
 * Menggunakan staleTime: Infinity karena data Al-Quran bersifat statis
 * dan tidak akan berubah. Cache disimpan selama sesi aplikasi.
 */

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ummahApiService } from "../api/ummahApiService";
import type { MushafPage } from "../types";

export const MUSHAF_PAGE_QUERY_KEY = "mushaf-page";

interface UseMushafPageResult {
  page: MushafPage | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

const MUSHAF_QUERY_OPTIONS = (pageNumber: number) => ({
  queryKey: [MUSHAF_PAGE_QUERY_KEY, pageNumber],
  queryFn: () => ummahApiService.getMushafPage(pageNumber),
  staleTime: Infinity, // Data Quran statis — tidak perlu refetch
  gcTime: 1000 * 60 * 60, // Simpan cache 1 jam
  retry: 2,
  enabled: pageNumber >= 1 && pageNumber <= 604,
});

export function useMushafPage(pageNumber: number): UseMushafPageResult {
  const { data, isLoading, isError, error } = useQuery<MushafPage, Error>(
    MUSHAF_QUERY_OPTIONS(pageNumber)
  );

  return {
    page: data,
    isLoading,
    isError,
    error: error as Error | null,
  };
}

/**
 * Prefetch 5 halaman sebelum dan 5 halaman sesudah halaman aktif.
 * Berjalan di background sehingga navigasi antar halaman terasa instan.
 */
export function usePrefetchMushafPages(currentPage: number, windowSize = 5) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const pages: number[] = [];
    for (let i = 1; i <= windowSize; i++) {
      if (currentPage - i >= 1) pages.push(currentPage - i);
      if (currentPage + i <= 604) pages.push(currentPage + i);
    }

    pages.forEach((page) => {
      queryClient.prefetchQuery(MUSHAF_QUERY_OPTIONS(page));
    });
  }, [currentPage, queryClient, windowSize]);
}
