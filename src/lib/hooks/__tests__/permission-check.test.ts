import { describe, it, expect } from "vitest";
import { checkPermission } from "../usePermission";
import { Role } from "@/types/domain/enums";
import type { AuthUser } from "@/types/domain/auth";

describe("checkPermission", () => {
  it("should return false for null user", () => {
    expect(checkPermission(null, "santri.create")).toBe(false);
  });

  it("should bypass all checks for superadmin role", () => {
    const superadmin: AuthUser = {
      id_user: 1,
      name: "Superadmin",
      email: "super@admin.com",
      role: Role.SUPERADMIN,
      roles: [Role.SUPERADMIN],
      permissions: [],
    };
    expect(checkPermission(superadmin, "any.permission")).toBe(true);
  });

  it("should match exact permission", () => {
    const muhafizUser: AuthUser = {
      id_user: 2,
      name: "Muhafiz",
      email: "muhafiz@test.com",
      role: Role.MUHAFIZ,
      roles: [Role.MUHAFIZ],
      permissions: ["santri:create-own", "halaqah:view-own"],
    };
    expect(checkPermission(muhafizUser, "santri:create-own")).toBe(true);
  });

  it("should resolve dot notation alias", () => {
    const muhafizUser: AuthUser = {
      id_user: 2,
      name: "Muhafiz",
      email: "muhafiz@test.com",
      role: Role.MUHAFIZ,
      roles: [Role.MUHAFIZ],
      permissions: ["santri:create-own", "halaqah:view-own"],
    };
    expect(checkPermission(muhafizUser, "santri.create")).toBe(true);
  });

  it("should fail when permission is missing", () => {
    const muhafizUser: AuthUser = {
      id_user: 2,
      name: "Muhafiz",
      email: "muhafiz@test.com",
      role: Role.MUHAFIZ,
      roles: [Role.MUHAFIZ],
      permissions: ["santri:create-own", "halaqah:view-own"],
    };
    expect(checkPermission(muhafizUser, "halaqah.delete")).toBe(false);
    expect(checkPermission(muhafizUser, "user.manage")).toBe(false);
  });

  it("should resolve admin permissions correctly", () => {
    const adminUser: AuthUser = {
      id_user: 3,
      name: "Admin Sekolah",
      email: "admin@test.com",
      role: Role.ADMIN,
      roles: [Role.ADMIN],
      permissions: ["muhafiz:manage", "halaqah:edit-all", "santri:create-all"],
    };
    expect(checkPermission(adminUser, "user.manage")).toBe(true);
    expect(checkPermission(adminUser, "halaqah.update")).toBe(true);
    expect(checkPermission(adminUser, "santri.create")).toBe(true);
  });
});
