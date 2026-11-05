import { lazy, Suspense } from "react";
import { Navigate, Outlet, type RouteObject } from "react-router-dom";
import { PortalProvider } from "@/features/portal/store/portal-context";

const PortalLoginPage = lazy(() => import("@/features/portal/pages/PortalLoginPage"));
const PortalDashboard = lazy(() => import("@/features/portal/pages/PortalDashboard"));

// Portal wrapper with isolated parent auth context
const PortalWrapper = () => (
  <PortalProvider>
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      <Outlet />
    </Suspense>
  </PortalProvider>
);

export const publicRoutes: RouteObject[] = [
  // ── Public: Portal Orang Tua (tanpa DashboardLayout) ─────────────────────
  {
    path: "/:slug/portal",
    element: <PortalWrapper />,
    children: [
      {
        index: true,
        element: <PortalLoginPage />,
      },
      {
        path: "dashboard",
        element: <PortalDashboard />,
      },
    ],
  },

  // ── Public: Display Portal (tidak butuh login) ───────────────────────────
  {
    path: "/display/:slug",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/display/:slug/santri/:id",
    element: <Navigate to="/login" replace />,
  },

  // ── Public: Landing & SEO Pages (tidak butuh login) ──────────────────────
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/about", element: <Navigate to="/login" replace /> },
  { path: "/features", element: <Navigate to="/login" replace /> },
  { path: "/contact", element: <Navigate to="/login" replace /> },
  { path: "/faq", element: <Navigate to="/login" replace /> },
  { path: "/blog", element: <Navigate to="/login" replace /> },
  { path: "/blog/:slug", element: <Navigate to="/login" replace /> },

  // Keyword Landings
  { path: "/aplikasi-halaqah", element: <Navigate to="/login" replace /> },
  { path: "/aplikasi-tahfidz", element: <Navigate to="/login" replace /> },
  { path: "/aplikasi-rumah-tahfidz", element: <Navigate to="/login" replace /> },
  { path: "/aplikasi-pondok-pesantren", element: <Navigate to="/login" replace /> },
  { path: "/aplikasi-tpq", element: <Navigate to="/login" replace /> },
  { path: "/aplikasi-setoran-hafalan", element: <Navigate to="/login" replace /> },
  { path: "/administrasi-tahfidz", element: <Navigate to="/login" replace /> },
  { path: "/monitoring-hafalan-santri", element: <Navigate to="/login" replace /> },
];

