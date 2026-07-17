import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { type RegisterFormValues } from "../../validation/auth.schema";
import { type GlobalResponse } from "@/types/api/response";
import { type RegisterAdminResponse } from "@/types/domain/auth";

export function useRegisterAdmin(): UseMutationResult<
  GlobalResponse<RegisterAdminResponse>,
  Error,
  Omit<RegisterFormValues, "confirmPassword">
> {
  return useMutation({
    mutationFn: (data: Omit<RegisterFormValues, "confirmPassword">) =>
      authService.registerAdmin(data),
  });
}
