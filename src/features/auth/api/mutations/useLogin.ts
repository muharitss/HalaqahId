import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { type LoginFormValues } from "../../validation/auth.schema";
import { type AuthResponse } from "@/types/domain/auth";

export function useLogin(): UseMutationResult<AuthResponse, Error, LoginFormValues> {
  return useMutation({
    mutationFn: (credentials: LoginFormValues) => authService.login(credentials),
  });
}
