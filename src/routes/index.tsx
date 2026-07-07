/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import React from "react";

import { useAuth } from "@/features/auth/components/auth-provider";
import { Role, isKepalaRole } from "@/types/domain/enums";
import { Spinner } from "@/components/ui/spinner";
import DashboardLayout from "@/layouts/DashboardLayout";

// ── Pages: Auth ────────────────────────────────────────────────────────────
import { LoginPage, RegisterPage, VerifyEmailPage } from "@/features/auth";

// ── Pages: Public Display ──────────────────────────────────────────────────
import { DisplayProvider } from "@/features/display/context/DisplayContext";
import PublicDisplay from "@/features/display/pages/PublicDisplay";
import SantriDetail from "@/features/display/pages/SantriDetail";

// ── Pages: Superadmin ──────────────────────────────────────────────────────
import { SuperadminDashboard, KepalaMuhafidzDashboard, MuhafizDashboard } from "@/features/dashboard";
import { KelolaSekolahPage } from "@/features/sekolah";
import KelolaUserPage from "@/features/dashboard/pages/kelola-user-page";
import KelolaAuditLogPage from "@/features/dashboard/pages/kelola-audit-log-page";

// ── Pages: Kepala Muhafidz ─────────────────────────────────────────────────
import KelolaMuhafizPage from "@/features/muhafiz";
import { KelolaHalaqahPage, KelolaSesiPage } from "@/features/halaqah";
import AbsensiPage from "@/features/absensi";
import { SetoranPage, LaporanSetoranPage } from "@/features/setoran";
import { MushafPage } from "@/features/setoran/pages/mushaf-page";
import { TahfidzAi } from "@/features/tahfidz-ai/components/TahfidzAi";
import { ProfilSekolahPage } from "@/features/sekolah";

// ── Pages: Settings ────────────────────────────────────────────────────────
import SettingsPage from "@/features/settings/pages";
import SuperadminSettingsPage from "@/features/settings/pages/SuperadminSettingsPage";
import InfoSection from "@/features/settings/pages/InfoSection";
import TrashSection from "@/features/settings/pages/TrashSection";
import KategoriSettingsPage from "@/features/settings/pages/KategoriSettingsPage";
import TargetSettingsPage from "@/features/settings/pages/TargetSettingsPage";

// ── Pages: Santri ──────────────────────────────────────────────────────────
import { KelolaSantriPage, ProgresSantriPage } from "@/features/santri";

// ── Pages: Muhafiz No Halaqah ──────────────────────────────────────────────
import { NoHalaqahView } from "@/features/halaqah/pages/NoHalaqah";

// ══════════════════════════════════════════════════════════════════════════════
// Guard & Helper Components
// ══════════════════════════════════════════════════════════════════════════════

/** Spinner terpusat untuk saat auth sedang di-resolve */
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spinner className="w-8 h-8" />
  </div>
);

/**
 * Route guard: hanya bisa diakses oleh user yang SUDAH login.
 * Jika `allowedRoles` diberikan, juga cek apakah role user diizinkan.
 */
const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: Role[] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === Role.SUPERADMIN) return <Navigate to="/superadmin" replace />;
    return isKepalaRole(user.role)
      ? <Navigate to="/kepala-muhafidz" replace />
      : <Navigate to="/muhafidz" replace />;
  }

  return <Outlet />;
};

/**
 * Route guard: hanya untuk tamu (belum login).
 * Jika sudah login, redirect ke halaman utama sesuai role.
 */
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (user) return <Navigate to="/" replace />;

  return <>{children}</>;
};

/** Redirect otomatis berdasarkan role setelah login */
const RoleRedirect = () => {
  const { user } = useAuth();

  if (user?.role === Role.SUPERADMIN) return <Navigate to="/superadmin" replace />;
  if (user && isKepalaRole(user.role)) return <Navigate to="/kepala-muhafidz" replace />;
  return <Navigate to="/muhafidz" replace />;
};

/**
 * Guard khusus Muhafiz: jika belum punya halaqah, tampilkan NoHalaqahView.
 * Settings tetap bisa diakses (route settings ada di luar guard ini).
 */
const MuhafizGuard = () => {
  const { user } = useAuth();

  if (user?.role === Role.MUHAFIZ && !user?.has_halaqah) {
    return <NoHalaqahView />;
  }

  return <Outlet />;
};

// ══════════════════════════════════════════════════════════════════════════════
// Router Configuration — Flat, single source of truth
// ══════════════════════════════════════════════════════════════════════════════

export const router = createBrowserRouter([
  // ── Public: Display Portal (tidak butuh login) ───────────────────────────
  {
    path: "/display/:slug",
    element: (
      <DisplayProvider>
        <PublicDisplay />
      </DisplayProvider>
    ),
  },
  {
    path: "/display/:slug/santri/:id",
    element: (
      <DisplayProvider>
        <SantriDetail />
      </DisplayProvider>
    ),
  },

  // ── Public: Auth Pages ────────────────────────────────────────────────────
  {
    path: "/login",
    element: <GuestRoute><LoginPage /></GuestRoute>,
  },
  {
    path: "/register",
    element: <GuestRoute><RegisterPage /></GuestRoute>,
  },
  {
    path: "/verify-email",
    element: <VerifyEmailPage />,
  },

  // ── Protected: Semua halaman yang butuh login ─────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          // Index: redirect berdasarkan role
          { index: true, element: <RoleRedirect /> },

          // ── SUPERADMIN ─────────────────────────────────────────────────────
          {
            element: <ProtectedRoute allowedRoles={[Role.SUPERADMIN]} />,
            children: [
              { path: "/superadmin", element: <SuperadminDashboard /> },
              { path: "/superadmin/sekolah", element: <KelolaSekolahPage /> },
              { path: "/superadmin/users", element: <KelolaUserPage /> },
              { path: "/superadmin/audit-logs", element: <KelolaAuditLogPage /> },
              { path: "/superadmin/settings", element: <SuperadminSettingsPage /> },
            ],
          },

          // ── KEPALA (SUPERADMIN | ADMIN | KOORDINATOR_TAHFIZ) ──────────────
          {
            element: <ProtectedRoute allowedRoles={[Role.SUPERADMIN, Role.ADMIN, Role.KOORDINATOR_TAHFIZ]} />,
            children: [
              { path: "/kepala-muhafidz", element: <KepalaMuhafidzDashboard /> },
              { path: "/kepala-muhafidz/muhafiz", element: <KelolaMuhafizPage /> },
              { path: "/kepala-muhafidz/halaqah", element: <KelolaHalaqahPage /> },
              { path: "/kepala-muhafidz/sesi", element: <KelolaSesiPage /> },
              { path: "/kepala-muhafidz/absensi", element: <AbsensiPage /> },
              { path: "/kepala-muhafidz/setoran", element: <SetoranPage /> },
              { path: "/kepala-muhafidz/setoran/mushaf", element: <MushafPage /> },
              { path: "/kepala-muhafidz/laporan", element: <LaporanSetoranPage /> },
              { path: "/kepala-muhafidz/tahfidzai", element: <TahfidzAi /> },
              { path: "/kepala-muhafidz/profil-sekolah", element: <ProfilSekolahPage /> },
              { path: "/kepala-muhafidz/settings", element: <SettingsPage /> },
              { path: "/kepala-muhafidz/settings/info", element: <InfoSection /> },
              { path: "/kepala-muhafidz/settings/trash", element: <TrashSection /> },
              { path: "/kepala-muhafidz/settings/kategori", element: <KategoriSettingsPage /> },
              { path: "/kepala-muhafidz/settings/target", element: <TargetSettingsPage /> },
              // Kontrol per-halaqah
              { path: "/kepala-muhafidz/halaqah/:halaqahId/absensi", element: <AbsensiPage /> },
              { path: "/kepala-muhafidz/halaqah/:halaqahId/setoran", element: <SetoranPage /> },
              { path: "/kepala-muhafidz/halaqah/:halaqahId/progres", element: <ProgresSantriPage /> },
            ],
          },

          // ── MUHAFIZ ────────────────────────────────────────────────────────
          {
            element: <ProtectedRoute allowedRoles={[Role.MUHAFIZ]} />,
            children: [
              // Route yang butuh halaqah aktif — guard akan tampilkan NoHalaqahView jika belum punya
              {
                element: <MuhafizGuard />,
                children: [
                  { path: "/muhafidz", element: <MuhafizDashboard /> },
                  { path: "/muhafidz/absensi", element: <AbsensiPage /> },
                  { path: "/muhafidz/setoran", element: <SetoranPage /> },
                  { path: "/muhafidz/setoran/mushaf", element: <MushafPage /> },
                  { path: "/muhafidz/santri", element: <KelolaSantriPage /> },
                  { path: "/muhafidz/progres", element: <ProgresSantriPage /> },
                  { path: "/muhafidz/laporan", element: <LaporanSetoranPage /> },
                  { path: "/muhafidz/tahfidzai", element: <TahfidzAi /> },
                ],
              },
              // Settings selalu bisa diakses meski belum punya halaqah
              { path: "/muhafidz/settings", element: <SettingsPage /> },
              { path: "/muhafidz/settings/info", element: <InfoSection /> },
            ],
          },
        ],
      },
    ],
  },

  // ── 404 Fallback ──────────────────────────────────────────────────────────
  { path: "*", element: <Navigate to="/" replace /> },
]);
