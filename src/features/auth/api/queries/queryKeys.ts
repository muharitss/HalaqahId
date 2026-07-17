import { type AllUsersParams, type AuditLogsParams } from "../../types";

export const authKeys = {
  all: () => ["auth"] as const,
  currentUser: () => [...authKeys.all(), "current-user"] as const,
  users: (params?: AllUsersParams) => 
    (params ? ([...authKeys.all(), "users", params] as const) : ([...authKeys.all(), "users"] as const)),
  auditLogs: (params?: AuditLogsParams) => 
    (params ? ([...authKeys.all(), "audit-logs", params] as const) : ([...authKeys.all(), "audit-logs"] as const)),
};
