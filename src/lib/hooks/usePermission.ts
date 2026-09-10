import { useAuthStore } from "@/store/useAuthStore";
import { Role } from "@/types/domain/enums";
import type { AuthUser } from "@/types/domain/auth";

/**
 * Common permission aliases / variations mapping.
 * Bridges dot notation used in UI plans (e.g. 'santri.create') with
 * granular backend colon-scoped permissions (e.g. 'santri:create-all', 'santri:create-own').
 */
const PERMISSION_ALIASES: Record<string, string[]> = {
  "santri.create": ["santri:create-all", "santri:create-own", "santri:create", "santri.create"],
  "santri.update": ["santri:edit-all", "santri:edit-own", "santri:edit", "santri.edit", "santri.update"],
  "santri.edit": ["santri:edit-all", "santri:edit-own", "santri:edit", "santri.edit", "santri.update"],
  "santri.delete": ["santri:delete-all", "santri:delete-own", "santri:delete", "santri.delete"],
  "santri.view": ["santri:view-all", "santri:view-own", "santri:view", "santri.view"],

  "halaqah.create": ["halaqah:create", "halaqah.create"],
  "halaqah.update": ["halaqah:edit-all", "halaqah:edit-own", "halaqah:edit", "halaqah.update"],
  "halaqah.edit": ["halaqah:edit-all", "halaqah:edit-own", "halaqah:edit", "halaqah.update"],
  "halaqah.delete": ["halaqah:delete-all", "halaqah:delete", "halaqah.delete"],
  "halaqah.view": ["halaqah:view-all", "halaqah:view-own", "halaqah:view", "halaqah.view"],

  "user.manage": ["muhafiz:manage", "user:manage", "user.manage"],
  "muhafiz.manage": ["muhafiz:manage", "user:manage", "muhafiz.manage"],
};

/**
 * Pure evaluation function to check if a user has a specific permission code.
 * Handles exact matching, dot/colon aliases, and superadmin bypass.
 */
export function checkPermission(user: AuthUser | null, code: string): boolean {
  if (!user) return false;

  // Superadmin has full system authority
  if (user.role === Role.SUPERADMIN || user.roles?.includes(Role.SUPERADMIN)) {
    return true;
  }

  const permissions = user.permissions || [];
  if (permissions.length === 0) return false;

  // 1. Direct exact match
  if (permissions.includes(code)) {
    return true;
  }

  // 2. Predefined alias match
  const aliases = PERMISSION_ALIASES[code];
  if (aliases && aliases.some((alias) => permissions.includes(alias))) {
    return true;
  }

  // 3. Dynamic dot-to-colon conversion and prefix expansion
  const colonCode = code.replace(/\./g, ":");
  if (permissions.includes(colonCode)) {
    return true;
  }

  if (
    permissions.some(
      (p) =>
        p === `${colonCode}-all` ||
        p === `${colonCode}-own` ||
        p.startsWith(`${colonCode}:`)
    )
  ) {
    return true;
  }

  return false;
}

/**
 * Hook to check if the current authenticated user has a specific permission.
 */
export function usePermission(code: string): boolean {
  const user = useAuthStore((s) => s.user);
  return checkPermission(user, code);
}

/**
 * Hook to check if the current authenticated user has AT LEAST ONE of the specified permissions.
 */
export function useAnyPermission(codes: string[]): boolean {
  const user = useAuthStore((s) => s.user);
  if (!codes || codes.length === 0) return true;
  return codes.some((code) => checkPermission(user, code));
}

/**
 * Hook to check if the current authenticated user has ALL of the specified permissions.
 */
export function useAllPermissions(codes: string[]): boolean {
  const user = useAuthStore((s) => s.user);
  if (!codes || codes.length === 0) return true;
  return codes.every((code) => checkPermission(user, code));
}
