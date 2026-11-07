import type { IzinFilterParams } from "../../types";

export const izinKeys = {
  all: ["izin"] as const,
  lists: () => [...izinKeys.all, "list"] as const,
  list: (params?: IzinFilterParams) => [...izinKeys.lists(), params ?? {}] as const,
  details: () => [...izinKeys.all, "detail"] as const,
  detail: (id: number) => [...izinKeys.details(), id] as const,
};
