import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { type GlobalResponse } from "@/types/api/response";

export function useResetPassword(): UseMutationResult<
  GlobalResponse<null>,
  Error,
  { id: number; data: { password: string } }
> {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { password: string } }) =>
      authService.resetPassword(id, data),
  });
}
