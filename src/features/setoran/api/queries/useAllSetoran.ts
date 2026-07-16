import { useQuery } from "@tanstack/react-query";
import { setoranService } from "../services/setoranService";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";

export function useAllSetoran() {
  return useQuery({
    queryKey: ["all-setoran"],
    queryFn: async () => {
      try {
        const res = await setoranService.getAllSetoran();
        return res.data || [];
      } catch (err: unknown) {
        toast.error(
          getErrorMessage(err, "Gagal mengambil semua data setoran")
        );
        throw err;
      }
    },
    enabled: false, // Manual fetch
  });
}