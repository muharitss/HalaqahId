import { useQuery } from "@tanstack/react-query";
import { sekolahService } from "../services/sekolahService";

export function useSekolahQueryList(page: number, limit: number, search?: string) {
  return useQuery({
    queryKey: ["sekolah-list", page, search],
    queryFn: () =>
      sekolahService.getAll({ page, limit, search: search || undefined }),
    placeholderData: (prev) => prev,
  });
}
