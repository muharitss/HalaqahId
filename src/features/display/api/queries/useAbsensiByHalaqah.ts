import { useQuery } from "@tanstack/react-query";
import { displayService } from "../services/displayService";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";

export function useAbsensiByHalaqah(
  slug: string | undefined,
  halaqahId: string | number | undefined,
  date: string | undefined,
  token?: string | null
) {
  return useQuery({
    queryKey: ["display-absensi-by-halaqah", slug, halaqahId, date, token],
    queryFn: async () => {
      if (!slug || halaqahId === undefined || !date) return [];
      try {
        return await displayService.getAbsensiByHalaqah(slug, halaqahId, date, token || undefined);
      } catch (err: unknown) {
        console.error("Gagal load absensi halaqah:", err);
        const status = (err as any)?.response?.status;
        if (status !== 401 && status !== 403) {
          toast.error(getErrorMessage(err, "Gagal memuat absensi halaqah"));
        }
        throw err;
      }
    },
    enabled: !!slug && halaqahId !== undefined && !!date,
  });
}
