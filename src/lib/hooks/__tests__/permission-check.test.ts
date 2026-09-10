import { checkPermission } from "../usePermission";
import { Role } from "@/types/domain/enums";
import type { AuthUser } from "@/types/domain/auth";

function assertStrictEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(`Assertion failed: ${message} (Expected: ${expected}, Got: ${actual})`);
  }
}

console.log("Running permission-check assertion self-test...");

// 1. Null user should fail
assertStrictEqual(checkPermission(null, "santri.create"), false, "Null user must return false");

// 2. Superadmin bypass
const superadmin: AuthUser = {
  id_user: 1,
  name: "Superadmin",
  email: "super@admin.com",
  role: Role.SUPERADMIN,
  roles: [Role.SUPERADMIN],
  permissions: [],
};
assertStrictEqual(checkPermission(superadmin, "any.permission"), true, "Superadmin role must bypass all permission checks");

// 3. Exact permission match
const muhafizUser: AuthUser = {
  id_user: 2,
  name: "Muhafiz",
  email: "muhafiz@test.com",
  role: Role.MUHAFIZ,
  roles: [Role.MUHAFIZ],
  permissions: ["santri:create-own", "halaqah:view-own"],
};
assertStrictEqual(checkPermission(muhafizUser, "santri:create-own"), true, "Direct exact match should pass");

// 4. Dot notation alias resolving (santri.create matches santri:create-own or santri:create-all)
assertStrictEqual(checkPermission(muhafizUser, "santri.create"), true, "santri.create should resolve to santri:create-own");

// 5. Missing permission
assertStrictEqual(checkPermission(muhafizUser, "halaqah.delete"), false, "User without halaqah:delete-all or halaqah.delete should fail");
assertStrictEqual(checkPermission(muhafizUser, "user.manage"), false, "Muhafiz without user.manage or muhafiz:manage should fail");

// 6. Admin user with user.manage (muhafiz:manage)
const adminUser: AuthUser = {
  id_user: 3,
  name: "Admin Sekolah",
  email: "admin@test.com",
  role: Role.ADMIN,
  roles: [Role.ADMIN],
  permissions: ["muhafiz:manage", "halaqah:edit-all", "santri:create-all"],
};
assertStrictEqual(checkPermission(adminUser, "user.manage"), true, "user.manage should resolve to muhafiz:manage");
assertStrictEqual(checkPermission(adminUser, "halaqah.update"), true, "halaqah.update should resolve to halaqah:edit-all");
assertStrictEqual(checkPermission(adminUser, "santri.create"), true, "santri.create should resolve to santri:create-all");

console.log("All permission-check assertions passed successfully!");
