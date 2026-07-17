import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { authKeys } from "./queryKeys";
import { type AllUsersParams, type GlobalUser } from "../../types";
import { type GlobalResponseWithPagination } from "@/types/api/response";

export function useAllUsers(
  params?: AllUsersParams,
  options?: { enabled?: boolean }
): UseQueryResult<GlobalResponseWithPagination<GlobalUser[]>, Error> {
  return useQuery({
    queryKey: authKeys.users(params),
    queryFn: () => authService.getAllUsers(params),
    placeholderData: (previousData) => previousData,
    ...options,
  });
}
