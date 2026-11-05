import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { santriWaliService } from "../services/santriWaliService";
import type { SantriWali } from "@/types/domain/santri-wali";

export const santriWaliKeys = {
  all: ["santri-wali"] as const,
  list: (santriId?: number) => [...santriWaliKeys.all, "list", santriId] as const,
};

export function useSantriWaliList(
  santriId?: number
): UseQueryResult<SantriWali[], Error> {
  return useQuery<SantriWali[], Error>({
    queryKey: santriWaliKeys.list(santriId),
    queryFn: () => {
      if (!santriId) return Promise.resolve([]);
      return santriWaliService.getWaliList(santriId);
    },
    enabled: !!santriId,
  });
}
