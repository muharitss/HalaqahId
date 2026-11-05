import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { santriService } from "../services/santriService";
import { getErrorMessage } from "@/utils/error";
import { type RiwayatHalaqahItem } from "../../types";

export function useRiwayatHalaqah(santriId?: number | null): UseQueryResult<RiwayatHalaqahItem[], Error> {
  return useQuery<RiwayatHalaqahItem[], Error>({
    queryKey: ["santri", "riwayat-halaqah", santriId],
    queryFn: async () => {
      if (!santriId) return [];
      try {
        return await santriService.getRiwayatHalaqah(santriId);
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err, "Gagal memuat riwayat halaqah"));
      }
    },
    enabled: typeof santriId === "number" && santriId > 0,
  });
}
