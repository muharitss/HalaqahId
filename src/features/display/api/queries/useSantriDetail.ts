import { useQuery } from "@tanstack/react-query";
import { displayService } from "../services/displayService";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";

export function useSantriDetail(
  slug: string | undefined,
  id: string | number | undefined,
  token?: string | null
) {
  return useQuery({
    queryKey: ["display-santri-detail", slug, id, token],
    queryFn: async () => {
      if (!slug || id === undefined) return null;
      try {
        return await displayService.getSantriDetail(slug, id, token || undefined);
      } catch (err: unknown) {
        console.error("Gagal load detail santri:", err);
        const status = (err as any)?.response?.status;
        if (status !== 401 && status !== 403) {
          toast.error(getErrorMessage(err, "Gagal memuat detail santri"));
        }
        throw err;
      }
    },
    enabled: !!slug && id !== undefined,
  });
}
