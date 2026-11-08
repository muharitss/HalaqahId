import { useQuery } from "@tanstack/react-query";
import { displayService } from "../services/displayService";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";

export function useSantriDetail(
  slug: string | undefined,
  id: string | number | undefined,
  month?: number | string,
  year?: number | string,
) {
  return useQuery({
    queryKey: ["display-santri-detail", slug, id, month, year],
    queryFn: async () => {
      if (!slug || id === undefined) return null;
      try {
        return await displayService.getSantriDetail(slug, id, month, year);
      } catch (err: unknown) {
        console.error("Gagal load detail santri:", err);
        toast.error(getErrorMessage(err, "Gagal memuat detail santri"));
        throw err;
      }
    },
    enabled: !!slug && id !== undefined,
  });
}
