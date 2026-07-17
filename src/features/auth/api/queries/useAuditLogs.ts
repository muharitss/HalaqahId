import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { authKeys } from "./queryKeys";
import { type AuditLogsParams, type AuditLog } from "../../types";
import { type GlobalResponseWithPagination } from "@/types/api/response";

export function useAuditLogs(
  params?: AuditLogsParams,
  options?: { enabled?: boolean }
): UseQueryResult<GlobalResponseWithPagination<AuditLog[]>, Error> {
  return useQuery({
    queryKey: authKeys.auditLogs(params),
    queryFn: () => authService.getAuditLogs(params),
    placeholderData: (previousData) => previousData,
    ...options,
  });
}
