import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { muhafizService } from "../services/muhafizService";
import { type AbsensiStatus } from "../../types";

export function useAbsensiMuhafizDaily(
  selectedDate: string | undefined,
  activeSesiId: number | null
): UseQueryResult<Record<number, AbsensiStatus>, Error> {
  return useQuery<Record<number, AbsensiStatus>, Error>({
    queryKey: ["absensi-muhafiz", selectedDate, activeSesiId],
    queryFn: async (): Promise<Record<number, AbsensiStatus>> => {
      try {
        if (!selectedDate) return {};
        const res = await muhafizService.getDailyAsatidz(
          selectedDate,
          activeSesiId ?? undefined,
        );
        if (!res.success || !Array.isArray(res.data)) return {};

        return res.data.reduce<Record<number, AbsensiStatus>>((acc: Record<number, AbsensiStatus>, item: any) => {
          if (item.id_user && item.status) {
            acc[item.id_user] = item.status as AbsensiStatus;
          }
          return acc;
        }, {});
      } catch {
        return {};
      }
    },
    enabled: !!selectedDate,
  });
}
