import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { santriService } from "../services/santriService";
import { getErrorMessage } from "@/utils/error";
import { type Santri } from "../../types";

export function useSantriList(halaqahId?: number | string, userId?: number): UseQueryResult<Santri[], Error> {
  return useQuery<Santri[], Error>({
    queryKey: ["santri", halaqahId, userId],
    queryFn: async () => {
      try {
        if (halaqahId) {
          return await santriService.getByHalaqahId(Number(halaqahId));
        }
        return await santriService.getAll();
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err, "Gagal memuat data santri"));
      }
    },
    enabled: userId !== undefined || halaqahId !== undefined,
  });
}
