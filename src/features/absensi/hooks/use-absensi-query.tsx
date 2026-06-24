import { useQuery } from "@tanstack/react-query";
import { absensiService } from "../api/absensiService";
import { sesiService } from "@/features/halaqah/api/sesiService";
import { format } from "date-fns";

// Query Keys
export const absensiKeys = {
  all: ["absensi"] as const,
  sesi: (sesiId: number, date: string) => [...absensiKeys.all, "sesi", sesiId, date] as const,
  rekapHalaqah: (halaqahId: number, month: string, year: string) => [...absensiKeys.all, "rekap", halaqahId, month, year] as const,
  rekapAll: (month: string, year: string) => [...absensiKeys.all, "rekap-all", month, year] as const,
};

export const sesiKeys = {
  all: ["sesi"] as const,
  list: () => [...sesiKeys.all, "list"] as const,
};

export const useSesiHalaqahQuery = () => {
  return useQuery({
    queryKey: sesiKeys.list(),
    queryFn: async () => {
      const res = await sesiService.getSesiHalaqah();
      return res.data || [];
    },
  });
};

export const useAbsensiSesiQuery = (sesiId: number | null, date: Date) => {
  const dateStr = format(date, "yyyy-MM-dd");
  return useQuery({
    queryKey: absensiKeys.sesi(sesiId!, dateStr),
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
  return useQuery({
    queryKey: halaqahId
      ? absensiKeys.rekapHalaqah(halaqahId, month, year)
      : absensiKeys.rekapAll(month, year),
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
