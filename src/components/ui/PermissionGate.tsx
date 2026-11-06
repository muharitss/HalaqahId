import React from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { checkPermission } from "@/lib/hooks/usePermission";

export interface PermissionGateProps {
  permission: string | string[];
  requireAll?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * PermissionGate renders its children only if the authenticated user
 * has the required permission(s).
 * If permission is an array, by default it checks if the user has ANY of them
 * (or ALL of them if requireAll is set to true).
 */
export function PermissionGate({
  permission,
  requireAll = false,
  children,
  fallback = null,
}: PermissionGateProps) {
  const user = useAuthStore((s) => s.user);
  const codes = Array.isArray(permission) ? permission : [permission];
  const hasAccess =
    codes.length === 0
      ? true
      : requireAll
        ? codes.every((code) => checkPermission(user, code))
        : codes.some((code) => checkPermission(user, code));

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

export default PermissionGate;
