import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { type GlobalResponse } from "@/types/api/response";
import { type VerifyEmailResponse } from "@/types/domain/auth";

export function useVerifyEmail(): UseMutationResult<
  GlobalResponse<VerifyEmailResponse>,
  Error,
  string
> {
  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
  });
}
