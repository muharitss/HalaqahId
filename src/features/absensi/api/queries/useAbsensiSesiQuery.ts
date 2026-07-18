import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { absensiService } from "../services/absensiService";
import { useAuth } from "@/features/auth";
import { absensiKeys } from "./queryKeys";

export const useAbsensiSesiQuery = (sesiId: number | null, date: Date) => {
  const { user } = useAuth();
  const dateStr = format(date, "yyyy-MM-dd");
  return useQuery({
    queryKey: absensiKeys.sesi(user?.id_user, sesiId!, dateStr),
    queryFn: async () => {
      const res = await absensiService.getAbsensiSesi(sesiId!, dateStr);
      return res.data || [];
    },
    enabled: !!sesiId,
  });
};
