import { useQuery } from "@tanstack/react-query";
import { portalService, PORTAL_TOKEN_KEY } from "../services/portalService";

export const portalQueryKeys = {
  all: ["portal"] as const,
  santri: () => [...portalQueryKeys.all, "santri"] as const,
  progress: () => [...portalQueryKeys.all, "progress"] as const,
  setoran: (page: number, limit: number) =>
    [...portalQueryKeys.all, "setoran", { page, limit }] as const,
  absensi: (page: number, limit: number) =>
    [...portalQueryKeys.all, "absensi", { page, limit }] as const,
  ujian: () => [...portalQueryKeys.all, "ujian"] as const,
};

const hasPortalToken = (): boolean => {
  return typeof window !== "undefined" && !!localStorage.getItem(PORTAL_TOKEN_KEY);
};

export const usePortalSantri = (enabled: boolean = true) => {
  return useQuery({
    queryKey: portalQueryKeys.santri(),
    queryFn: () => portalService.getSantri(),
    enabled: enabled && hasPortalToken(),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePortalProgress = (enabled: boolean = true) => {
  return useQuery({
    queryKey: portalQueryKeys.progress(),
    queryFn: () => portalService.getProgress(),
    enabled: enabled && hasPortalToken(),
    staleTime: 2 * 60 * 1000,
  });
};

export const usePortalSetoran = (
  page: number = 1,
  limit: number = 20,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: portalQueryKeys.setoran(page, limit),
    queryFn: () => portalService.getSetoran(page, limit),
    enabled: enabled && hasPortalToken(),
    staleTime: 2 * 60 * 1000,
  });
};

export const usePortalAbsensi = (
  page: number = 1,
  limit: number = 30,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: portalQueryKeys.absensi(page, limit),
    queryFn: () => portalService.getAbsensi(page, limit),
    enabled: enabled && hasPortalToken(),
    staleTime: 2 * 60 * 1000,
  });
};

export const usePortalUjian = (enabled: boolean = true) => {
  return useQuery({
    queryKey: portalQueryKeys.ujian(),
    queryFn: () => portalService.getUjian(),
    enabled: enabled && hasPortalToken(),
    staleTime: 5 * 60 * 1000,
  });
};
