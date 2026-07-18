import { useQuery } from "@tanstack/react-query";
import { displayService } from "../services/displayService";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";

export function useSantriDetail(slug: string | undefined, id: string | number | undefined) {
  return useQuery({
    queryKey: ["display-santri-detail", slug, id],
    queryFn: async () => {
      if (!slug || id === undefined) return null;
      try {
        return await displayService.getSantriDetail(slug, id);
      } catch (err: unknown) {
        console.error("Gagal load detail santri:", err);
        toast.error(getErrorMessage(err, "Gagal memuat detail santri"));
        throw err;
      }
    },
    enabled: !!slug && id !== undefined,
  });
}
