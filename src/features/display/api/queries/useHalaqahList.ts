import { useQuery } from "@tanstack/react-query";
import { displayService } from "../services/displayService";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";

export function useHalaqahList(slug: string | undefined, token?: string | null) {
  return useQuery({
    queryKey: ["display-halaqah-list", slug, token],
    queryFn: async () => {
      if (!slug) return [];
      try {
        return await displayService.getHalaqahList(slug, token || undefined);
      } catch (err: unknown) {
        console.error("Gagal load daftar halaqah:", err);
        const status = (err as any)?.response?.status;
        if (status !== 401 && status !== 403) {
          toast.error(getErrorMessage(err, "Gagal memuat daftar halaqah"));
        }
        throw err;
      }
    },
    enabled: !!slug,
  });
}
