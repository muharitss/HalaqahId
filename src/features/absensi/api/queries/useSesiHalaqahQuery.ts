import { useQuery } from "@tanstack/react-query";
import { sesiService } from "@/features/halaqah";
import { useAuth } from "@/features/auth";
import { sesiKeys } from "./queryKeys";

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
