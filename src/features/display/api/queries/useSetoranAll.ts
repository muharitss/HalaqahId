import { useQuery } from "@tanstack/react-query";
import { displayService } from "../services/displayService";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";

export function useSetoranAll(slug: string | undefined, token?: string | null) {
  return useQuery({
    queryKey: ["display-setoran-all", slug, token],
    queryFn: async () => {
      if (!slug) return [];
      try {
        return await displayService.getSetoranAll(slug, token || undefined);
      } catch (err: unknown) {
        console.error("Gagal load seluruh setoran:", err);
        const status = (err as any)?.response?.status;
        if (status !== 401 && status !== 403) {
          toast.error(getErrorMessage(err, "Gagal memuat seluruh setoran"));
        }
        throw err;
      }
    },
    enabled: !!slug,
  });
}
