import { useQuery } from "@tanstack/react-query";
import { displayService } from "../services/displayService";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";

export function useHalaqahList(slug: string | undefined) {
  return useQuery({
    queryKey: ["display-halaqah-list", slug],
    queryFn: async () => {
      if (!slug) return [];
      try {
        return await displayService.getHalaqahList(slug);
      } catch (err: unknown) {
        console.error("Gagal load daftar halaqah:", err);
        toast.error(getErrorMessage(err, "Gagal memuat daftar halaqah"));
        throw err;
      }
    },
    enabled: !!slug,
  });
}
