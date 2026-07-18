import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { authKeys } from "../queries/queryKeys";
import { type GlobalResponse } from "@/types/api/response";

export function useVerifyUser(): UseMutationResult<GlobalResponse<null>, Error, number> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => authService.verifyUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.users() });
    },
  });
}
