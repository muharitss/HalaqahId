import { useQuery } from "@tanstack/react-query";
import { absensiService } from "../services/absensiService";
import { useAuth } from "@/features/auth";
import { absensiKeys } from "./queryKeys";
import { type MonthlyAbsensiData } from "../../types";

export const useAbsensiRekapQuery = (
  month: string,
  year: string,
  halaqahId?: number
) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: halaqahId
      ? absensiKeys.rekapHalaqah(user?.id_user, halaqahId, month, year)
      : absensiKeys.rekapAll(user?.id_user, month, year),
    queryFn: async () => {
      if (halaqahId) {
        const res = await absensiService.getRekapHalaqah(halaqahId, undefined, month, year);
        return (res.data as MonthlyAbsensiData[]) || [];
      } else {
        const res = await absensiService.getAllRekapSantri(month, year);
        return res.data || [];
      }
    },
  });
};
