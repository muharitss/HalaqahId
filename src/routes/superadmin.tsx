import { lazy } from "react";
import { type RouteObject } from "react-router-dom";
import { FeatureRouteGuard } from "./guards";

const SuperadminDashboard = lazy(() =>
  import("@/features/dashboard/pages/superadmin-dashboard").then((m) => ({ default: m.SuperadminDashboard }))
);
const KelolaSekolahPage = lazy(() =>
  import("@/features/sekolah/pages/index")
);
const KelolaUserPage = lazy(() =>
  import("@/features/auth/pages/KelolaUserPage")
);
const KelolaRolePage = lazy(() =>
  import("@/features/role").then((m) => ({ default: m.KelolaRolePage }))
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
const TerminologySettingsPage = lazy(() =>
  import("@/features/settings/pages/TerminologySettingsPage")
);
const KelolaBlogPage = lazy(() =>
  import("@/features/blog/pages/KelolaBlogPage")
);

const ProfilPage = lazy(() =>
  import("@/features/profil/pages/UserProfilePage").then((m) => ({ default: m.UserProfilePage }))
);

export const superadminRoutes: RouteObject[] = [
  { path: "/superadmin", element: <SuperadminDashboard /> },
  { path: "/superadmin/sekolah", element: <KelolaSekolahPage /> },
  { path: "/superadmin/users", element: <KelolaUserPage /> },
  { path: "/superadmin/roles", element: <KelolaRolePage /> },
  { path: "/superadmin/audit-logs", element: <KelolaAuditLogPage /> },
  { path: "/superadmin/profil", element: <ProfilPage /> },
  { path: "/superadmin/settings", element: <SuperadminSettingsPage /> },
  { path: "/superadmin/settings/terminology", element: <TerminologySettingsPage /> },
  { path: "/superadmin/settings/trash", element: <TrashPage /> },
  {
    path: "/superadmin/blog",
    element: (
      <FeatureRouteGuard code="BLOG">
        <KelolaBlogPage />
      </FeatureRouteGuard>
    ),
  },
];
