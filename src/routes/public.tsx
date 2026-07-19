import { Navigate, type RouteObject } from "react-router-dom";

export const publicRoutes: RouteObject[] = [
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

