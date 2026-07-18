import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { type GlobalResponse } from "@/types/api/response";

export function useResendVerification(): UseMutationResult<GlobalResponse<null>, Error, string> {
  return useMutation({
    mutationFn: (email: string) => authService.resendVerification(email),
  });
}
