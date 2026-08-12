import { useQuery } from "@tanstack/react-query";
import { setoranService } from "../services/setoranService";
import { sesiService } from "@/features/halaqah/api/sesiService";
import { useAuth } from "@/features/auth/components/auth-provider";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";

export function useSantriSesi() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["santri-sesi", user?.id_user],
    queryFn: async () => {
      try {
        const [resSantri, resSesi] = await Promise.all([
          setoranService.getSantriList(),
          sesiService.getSesiHalaqah(),
        ]);
        return {
          santriList: resSantri.data || [],
          sesiList: resSesi.data || [],
        };
      } catch (err: unknown) {
        console.error("Gagal mengambil daftar santri dan sesi:", err);
        toast.error(
          getErrorMessage(err, "Gagal memuat daftar santri dan sesi")
        );
        throw err;
      }
    },
    enabled: !!user?.id_user,
  });
}