import { useQuery } from "@tanstack/react-query";
import { rubrikService } from "../services/rubrikService";
import type { TipeRubrik } from "../../types";

export const rubrikKeys = {
  all: ["rubrik"] as const,
  lists: () => [...rubrikKeys.all, "list"] as const,
  list: (tipe?: TipeRubrik) => [...rubrikKeys.lists(), { tipe }] as const,
  details: () => [...rubrikKeys.all, "detail"] as const,
  detail: (id: number) => [...rubrikKeys.details(), id] as const,
};

export function useRubrikList(tipe?: TipeRubrik) {
  return useQuery({
    queryKey: rubrikKeys.list(tipe),
    queryFn: async () => {
      const res = await rubrikService.getAll(tipe);
      return res.data || [];
    },
  });
}

export function useRubrikDetail(id?: number) {
  return useQuery({
    queryKey: id ? rubrikKeys.detail(id) : ["rubrik", "detail", "empty"],
    queryFn: async () => {
      if (!id) return null;
      const res = await rubrikService.getById(id);
      return res.data || null;
    },
    enabled: !!id,
  });
}
