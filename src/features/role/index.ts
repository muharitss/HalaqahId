// Pages
export { KelolaRolePage, default as KelolaRolePageDefault } from "./pages/KelolaRolePage";

// Components
export { RoleForm } from "./components/RoleForm";
export { PermissionMatrix } from "./components/PermissionMatrix";

// API
export { roleApi } from "./api/role.api";

// Hooks
export {
  useRoles,
  useRolePermissions,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  useUpdateRolePermissions,
  ROLE_QUERY_KEYS,
} from "./hooks/useRoles";

// Types
export type {
  RoleItem,
  PermissionItem,
  CreateRolePayload,
  UpdateRolePayload,
  UpdateRolePermissionsPayload,
  PermissionDefinition,
  PermissionActionCategory,
} from "./types";

// Constants
export {
  ACTION_COLUMNS,
  SYSTEM_PERMISSION_DEFINITIONS,
  getGroupedPermissions,
} from "./constants/permissions";
