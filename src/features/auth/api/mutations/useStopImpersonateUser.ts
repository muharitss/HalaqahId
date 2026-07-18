import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { type GlobalResponse } from "@/types/api/response";

export function useStopImpersonateUser(): UseMutationResult<
  GlobalResponse<null>,
  Error,
  { targetUserId: number }
> {
  return useMutation({
    mutationFn: (data: { targetUserId: number }) => authService.stopImpersonateUser(data),
  });
}
