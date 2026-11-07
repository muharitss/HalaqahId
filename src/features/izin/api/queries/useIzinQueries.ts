import { useQuery } from "@tanstack/react-query";
import { izinService } from "../services/izinService";
import { izinKeys } from "./izinQueryKeys";
import type { IzinFilterParams } from "../../types";

export function useIzinList(params?: IzinFilterParams) {
  return useQuery({
    queryKey: izinKeys.list(params),
    queryFn: async () => {
      const res = await izinService.getIzinList(params);
      return {
        data: res.data || [],
        pagination: res.pagination,
      };
    },
  });
}

export function useIzinDetail(id?: number) {
  return useQuery({
    queryKey: id ? izinKeys.detail(id) : ["izin", "detail", "empty"],
    queryFn: async () => {
      if (!id) return null;
      const res = await izinService.getIzinDetail(id);
      return res.data || null;
    },
    enabled: !!id,
  });
}
