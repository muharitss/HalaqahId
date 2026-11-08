import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { type GlobalResponse } from "@/types/api/response";

export function useForgotPassword(): UseMutationResult<
  GlobalResponse<null>,
  Error,
  { email: string }
> {
  return useMutation({
    mutationFn: (data: { email: string }) => authService.forgotPassword(data),
  });
}
