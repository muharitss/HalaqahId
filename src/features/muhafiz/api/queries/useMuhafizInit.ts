import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { muhafizService } from "../services/muhafizService";
import { sesiService } from "@/features/halaqah/api/sesiService";
import { type Muhafiz } from "../../types";
import { type SesiHalaqah } from "@/types/domain/sesi-halaqah";
import { toast } from "sonner";

export interface MuhafizInitData {
  muhafizList: Muhafiz[];
  activeMuhafizIds: Set<number>;
  sesiList: SesiHalaqah[];
}

export function useMuhafizInit(userId: number | undefined): UseQueryResult<MuhafizInitData, Error> {
  return useQuery<MuhafizInitData, Error>({
    queryKey: ["muhafiz-init", userId],
    queryFn: async (): Promise<MuhafizInitData> => {
      try {
        const [muhafizRes, activeIds, sesiRes] = await Promise.all([
          muhafizService.getAllMuhafiz(),
          muhafizService.getActiveMuhafizIds(),
          sesiService.getSesiHalaqah()
        ]);
        const sesiData = sesiRes.data || [];
        return {
          muhafizList: muhafizRes,
          activeMuhafizIds: activeIds,
          sesiList: sesiData,
        };
      } catch (err) {
        toast.error("Gagal memuat data muhafiz");
        throw err;
      }
    },
    enabled: !!userId,
  });
}
