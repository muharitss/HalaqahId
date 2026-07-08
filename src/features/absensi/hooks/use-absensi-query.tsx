import { useQuery } from "@tanstack/react-query";
import { absensiService } from "../api/absensiService";
import { sesiService } from "@/features/halaqah/api/sesiService";
import { format } from "date-fns";
import { useAuth } from "@/features/auth/components/auth-provider";

// Query Keys
export const absensiKeys = {
  all: (userId?: number) => (userId ? ["absensi", userId] : ["absensi"]) as const,
  sesi: (userId: number | undefined, sesiId: number, date: string) => [...absensiKeys.all(userId), "sesi", sesiId, date] as const,
  rekapHalaqah: (userId: number | undefined, halaqahId: number, month: string, year: string) => [...absensiKeys.all(userId), "rekap", halaqahId, month, year] as const,
  rekapAll: (userId: number | undefined, month: string, year: string) => [...absensiKeys.all(userId), "rekap-all", month, year] as const,
};

export const sesiKeys = {
  all: (userId?: number) => (userId ? ["sesi", userId] : ["sesi"]) as const,
  list: (userId?: number) => [...sesiKeys.all(userId), "list"] as const,
};

export const useSesiHalaqahQuery = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: sesiKeys.list(user?.id_user),
    queryFn: async () => {
      const res = await sesiService.getSesiHalaqah();
      return res.data || [];
    },
  });
};

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
        return (res.data as import("../types/absensi.schema").MonthlyAbsensiData[]) || [];
      } else {
        const res = await absensiService.getAllRekapSantri(month, year);
        return res.data || [];
      }
    },
  });
};
