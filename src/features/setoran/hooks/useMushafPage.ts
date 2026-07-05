/**
 * useMushafPage.ts
 * React Query hook untuk mengambil data halaman mushaf dari UmmahAPI.
 *
 * Menggunakan staleTime: Infinity karena data Al-Quran bersifat statis
 * dan tidak akan berubah. Cache disimpan selama sesi aplikasi.
 */

import { useQuery } from "@tanstack/react-query";
import { ummahApiService } from "../api/ummahApiService";
import type { MushafPage } from "../types";

export const MUSHAF_PAGE_QUERY_KEY = "mushaf-page";

interface UseMushafPageResult {
  page: MushafPage | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export function useMushafPage(pageNumber: number): UseMushafPageResult {
  const { data, isLoading, isError, error } = useQuery<MushafPage, Error>({
    queryKey: [MUSHAF_PAGE_QUERY_KEY, pageNumber],
    queryFn: () => ummahApiService.getMushafPage(pageNumber),
    staleTime: Infinity, // Data Quran statis — tidak perlu refetch
    gcTime: 1000 * 60 * 60, // Simpan cache 1 jam
    retry: 2,
    enabled: pageNumber >= 1 && pageNumber <= 604,
  });

  return {
    page: data,
    isLoading,
    isError,
    error: error as Error | null,
  };
}
