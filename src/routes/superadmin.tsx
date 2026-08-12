import { lazy } from "react";
import { type RouteObject } from "react-router-dom";

const SuperadminDashboard = lazy(() =>
  import("@/features/dashboard/pages/superadmin-dashboard").then((m) => ({ default: m.SuperadminDashboard }))
);
const KelolaSekolahPage = lazy(() =>
  import("@/features/sekolah/pages/index")
);
const KelolaUserPage = lazy(() =>
  import("@/features/auth/pages/KelolaUserPage")
);
const KelolaAuditLogPage = lazy(() =>
  import("@/features/auth/pages/KelolaAuditLogPage")
);
const SuperadminSettingsPage = lazy(() =>
  import("@/features/settings/pages/SuperadminSettingsPage")
);
const TrashPage = lazy(() =>
  import("@/features/settings/pages/TrashPage")
);
const KelolaBlogPage = lazy(() =>
  import("@/features/blog/pages/KelolaBlogPage").then((m) => ({ default: m.KelolaBlogPage }))
);

export const superadminRoutes: RouteObject[] = [
  { path: "/superadmin", element: <SuperadminDashboard /> },
  { path: "/superadmin/sekolah", element: <KelolaSekolahPage /> },
  { path: "/superadmin/users", element: <KelolaUserPage /> },
  { path: "/superadmin/audit-logs", element: <KelolaAuditLogPage /> },
  { path: "/superadmin/settings", element: <SuperadminSettingsPage /> },
  { path: "/superadmin/settings/trash", element: <TrashPage /> },
  { path: "/superadmin/blog", element: <KelolaBlogPage /> },
];
