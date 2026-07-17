import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { authKeys } from "./queryKeys";
import { type AuthResponse } from "@/types/domain/auth";

export function useCurrentUser(
  options?: { enabled?: boolean }
): UseQueryResult<AuthResponse, Error> {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: () => authService.getCurrentUser(),
    ...options,
  });
}
