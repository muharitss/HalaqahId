/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router-dom";

// Layout & Guards
import DashboardLayout from "@/layouts/DashboardLayout";
import { ProtectedRoute, RoleRedirect } from "./guards";
import { Role } from "@/types/domain/enums";

// Domain Routes
import { publicRoutes } from "./public";
import { authRoutes } from "./auth";
import { superadminRoutes } from "./superadmin";
import { kepalaRoutes } from "./kepala";
import { muhafizRoutes } from "./muhafiz";

// Fallback Page
import { NotFoundPage } from "@/features/landing";

export const router = createBrowserRouter([
  // ── Public: Portal & Landing Pages (tidak butuh login) ───────────────────
  ...publicRoutes,

  // ── Public: Auth Pages ────────────────────────────────────────────────────
  ...authRoutes,

  // ── Protected: Semua halaman yang butuh login ─────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/dashboard", element: <RoleRedirect /> },

          // ── SUPERADMIN ─────────────────────────────────────────────────────
          {
            element: <ProtectedRoute allowedRoles={[Role.SUPERADMIN]} />,
            children: superadminRoutes,
          },

          // ── KEPALA (SUPERADMIN | ADMIN | KOORDINATOR_TAHFIZ) ──────────────
          {
            element: (
              <ProtectedRoute
                allowedRoles={[
                  Role.SUPERADMIN,
                  Role.ADMIN,
                  Role.KOORDINATOR_TAHFIZ,
                ]}
              />
            ),
            children: kepalaRoutes,
          },

          // ── MUHAFIZ ────────────────────────────────────────────────────────
          {
            element: <ProtectedRoute allowedRoles={[Role.MUHAFIZ]} />,
            children: muhafizRoutes,
          },
        ],
      },
    ],
  },

  // ── 404 Fallback ──────────────────────────────────────────────────────────
  { path: "*", element: <NotFoundPage /> },
]);
