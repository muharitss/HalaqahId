import { useQuery } from "@tanstack/react-query";
import { displayService } from "../services/displayService";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";

export function useSetoranAll(slug: string | undefined) {
  return useQuery({
    queryKey: ["display-setoran-all", slug],
    queryFn: async () => {
      if (!slug) return [];
      try {
        return await displayService.getSetoranAll(slug);
      } catch (err: unknown) {
        console.error("Gagal load seluruh setoran:", err);
        toast.error(getErrorMessage(err, "Gagal memuat seluruh setoran"));
        throw err;
      }
    },
    enabled: !!slug,
  });
}
