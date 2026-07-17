import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { type AuthResponse } from "@/types/domain/auth";

export function useImpersonateUser(): UseMutationResult<AuthResponse, Error, number> {
  return useMutation({
    mutationFn: (id: number) => authService.impersonateUser(id),
  });
}
