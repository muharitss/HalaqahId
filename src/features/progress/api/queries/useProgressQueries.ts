import { useQuery } from "@tanstack/react-query";
import { progressService } from "../services/progressService";

export const progressKeys = {
  all: ["progress"] as const,
  santriAll: (santriId: number) => [...progressKeys.all, "santri", santriId] as const,
  list: (santriId: number, params?: { status?: string; search?: string }) =>
    [...progressKeys.santriAll(santriId), "list", params] as const,
  summary: (santriId: number) =>
    [...progressKeys.santriAll(santriId), "summary"] as const,
};

export function useSantriProgressList(
  santriId?: number,
  params?: { status?: string; search?: string }
) {
  return useQuery({
    queryKey: santriId
      ? progressKeys.list(santriId, params)
      : ["progress", "list", "empty"],
    queryFn: async () => {
      if (!santriId) return [];
      const res = await progressService.getProgressList(santriId, params);
      return res.data || [];
    },
    enabled: !!santriId,
  });
}

export function useSantriProgressSummary(santriId?: number) {
  return useQuery({
    queryKey: santriId
      ? progressKeys.summary(santriId)
      : ["progress", "summary", "empty"],
    queryFn: async () => {
      if (!santriId) return null;
      const res = await progressService.getSummary(santriId);
      return res.data || null;
    },
    enabled: !!santriId,
  });
}
