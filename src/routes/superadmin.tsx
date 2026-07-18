import { type RouteObject } from "react-router-dom";
import { SuperadminDashboard } from "@/features/dashboard";
import { KelolaSekolahPage } from "@/features/sekolah";
import { KelolaUserPage, KelolaAuditLogPage } from "@/features/auth";
import { SuperadminSettingsPage, TrashPage } from "@/features/settings";
import { KelolaBlogPage } from "@/features/blog";

export const superadminRoutes: RouteObject[] = [
  { path: "/superadmin", element: <SuperadminDashboard /> },
  { path: "/superadmin/sekolah", element: <KelolaSekolahPage /> },
  { path: "/superadmin/users", element: <KelolaUserPage /> },
  { path: "/superadmin/audit-logs", element: <KelolaAuditLogPage /> },
  { path: "/superadmin/settings", element: <SuperadminSettingsPage /> },
  { path: "/superadmin/settings/trash", element: <TrashPage /> },
  { path: "/superadmin/blog", element: <KelolaBlogPage /> },
];
