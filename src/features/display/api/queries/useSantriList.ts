import { useQuery } from "@tanstack/react-query";
import { displayService } from "../services/displayService";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";

export function useSantriList(slug: string | undefined) {
  return useQuery({
    queryKey: ["display-santri-list", slug],
    queryFn: async () => {
      if (!slug) return [];
      try {
        return await displayService.getSantriList(slug);
      } catch (err: unknown) {
        console.error("Gagal load daftar santri:", err);
        toast.error(getErrorMessage(err, "Gagal memuat daftar santri"));
        throw err;
      }
    },
    enabled: !!slug,
  });
}
