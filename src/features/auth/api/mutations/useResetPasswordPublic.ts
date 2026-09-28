import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { type GlobalResponse } from "@/types/api/response";

export function useResetPasswordPublic(): UseMutationResult<
  GlobalResponse<null>,
  Error,
  { token: string; password_baru: string }
> {
  return useMutation({
    mutationFn: (data: { token: string; password_baru: string }) =>
      authService.resetPasswordPublic(data),
  });
}
