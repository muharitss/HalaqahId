import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { santriService } from "../services/santriService";
import { getErrorMessage } from "@/utils/error";
import { type RiwayatAkademikItem } from "../../types";

export function useRiwayatAkademik(
  santriId?: number | null
): UseQueryResult<RiwayatAkademikItem[], Error> {
  return useQuery<RiwayatAkademikItem[], Error>({
    queryKey: ["santri", "riwayat-akademik", santriId],
    queryFn: async () => {
      if (!santriId) return [];
      try {
        return await santriService.getRiwayatAkademik(santriId);
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err, "Gagal memuat riwayat akademik"));
      }
    },
    enabled: typeof santriId === "number" && santriId > 0,
  });
}
