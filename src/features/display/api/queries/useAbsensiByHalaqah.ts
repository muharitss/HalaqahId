import { useQuery } from "@tanstack/react-query";
import { displayService } from "../services/displayService";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";

export function useAbsensiByHalaqah(
  slug: string | undefined,
  halaqahId: string | number | undefined,
  date: string | undefined
) {
  return useQuery({
    queryKey: ["display-absensi-by-halaqah", slug, halaqahId, date],
    queryFn: async () => {
      if (!slug || halaqahId === undefined || !date) return [];
      try {
        return await displayService.getAbsensiByHalaqah(slug, halaqahId, date);
      } catch (err: unknown) {
        console.error("Gagal load absensi halaqah:", err);
        toast.error(getErrorMessage(err, "Gagal memuat absensi halaqah"));
        throw err;
      }
    },
    enabled: !!slug && halaqahId !== undefined && !!date,
  });
}
