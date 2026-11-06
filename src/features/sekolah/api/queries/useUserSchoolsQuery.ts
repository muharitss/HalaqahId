import { useQuery } from "@tanstack/react-query";
import { sekolahService } from "../services/sekolahService";
import type { UserSekolahItem } from "@/types/domain/sekolah";

export const USER_SCHOOLS_QUERY_KEY = (userId?: number) => ["user-schools", userId] as const;

export function useUserSchoolsQuery(userId?: number) {
  return useQuery<UserSekolahItem[]>({
    queryKey: USER_SCHOOLS_QUERY_KEY(userId),
    queryFn: async () => {
      if (!userId) return [];
      const res = await sekolahService.getUserSchools(userId);
      return res.data || [];
    },
    enabled: !!userId,
  });
}
