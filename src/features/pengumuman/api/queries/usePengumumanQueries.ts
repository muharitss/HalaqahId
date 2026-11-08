import { useQuery } from "@tanstack/react-query";
import { pengumumanService } from "../services/pengumumanService";
import type { PengumumanFilterQuery } from "../../types";

export const pengumumanKeys = {
  all: ["pengumuman"] as const,
  lists: () => [...pengumumanKeys.all, "list"] as const,
  list: (filters?: PengumumanFilterQuery) =>
    [...pengumumanKeys.lists(), filters ?? {}] as const,
  details: () => [...pengumumanKeys.all, "detail"] as const,
  detail: (id: number) => [...pengumumanKeys.details(), id] as const,
  unreadCount: () => [...pengumumanKeys.all, "unread-count"] as const,
};

export function usePengumumanList(filters?: PengumumanFilterQuery) {
  return useQuery({
    queryKey: pengumumanKeys.list(filters),
    queryFn: async () => {
      const res = await pengumumanService.getPengumumanList(filters);
      return {
        data: res.data || [],
        pagination: res.pagination,
      };
    },
  });
}

export function usePengumumanDetail(id?: number) {
  return useQuery({
    queryKey: id ? pengumumanKeys.detail(id) : ["pengumuman", "detail", "empty"],
    queryFn: async () => {
      if (!id) return null;
      const res = await pengumumanService.getPengumumanDetail(id);
      return res.data || null;
    },
    enabled: !!id,
  });
}

export function usePengumumanUnreadCount() {
  return useQuery({
    queryKey: pengumumanKeys.unreadCount(),
    queryFn: async () => {
      const res = await pengumumanService.getUnreadCount();
      return res.data?.unread_count ?? 0;
    },
    refetchInterval: 60000, // refresh every minute
  });
}
