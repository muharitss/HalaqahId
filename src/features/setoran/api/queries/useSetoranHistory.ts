import { useQuery } from "@tanstack/react-query";
import { setoranService } from "../services/setoranService";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";

export function useSetoranHistory(santriId: number | null) {
  return useQuery({
    queryKey: ["setoran-history", santriId],
    queryFn: async () => {
      if (!santriId) return [];
      try {
        const res = await setoranService.getSetoranBySantri(santriId);
        return res.data || [];
      } catch (err: unknown) {
        console.error("Gagal mengambil riwayat santri:", err);
        toast.error(
          getErrorMessage(err, "Gagal memuat riwayat setoran santri")
        );
        throw err;
      }
    },
    enabled: !!santriId,
  });
}