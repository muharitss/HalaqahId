import { useQuery } from "@tanstack/react-query";
import { sekolahService } from "../services/sekolahService";
import { toast } from "sonner";

export function useProfilSekolahQuery() {
  return useQuery({
    queryKey: ["profil-sekolah"],
    queryFn: async () => {
      try {
        const res = await sekolahService.getProfile();
        return res.data ?? null;
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : "Gagal memuat profil sekolah");
        throw error;
      }
    },
  });
}
