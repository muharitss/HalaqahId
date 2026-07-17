import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { progresService } from "../services/progresService";
import { type ProgresSantri } from "../../types";

export function useProgresList(userId: number | undefined, scope: string = "target"): UseQueryResult<ProgresSantri[], Error> {
  return useQuery<ProgresSantri[], Error>({
    queryKey: ["progres", userId, scope],
    queryFn: async () => {
      const response = await progresService.getAllProgres(scope);
      return response.data || [];
    },
    enabled: !!userId,
  });
}
