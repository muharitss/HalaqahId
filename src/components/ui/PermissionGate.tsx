import React from "react";
import {
  usePermission,
  useAnyPermission,
  useAllPermissions,
} from "@/lib/hooks/usePermission";

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
  const hasAccess = Array.isArray(permission)
    ? requireAll
      ? useAllPermissions(permission)
      : useAnyPermission(permission)
    : usePermission(permission);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

export default PermissionGate;
