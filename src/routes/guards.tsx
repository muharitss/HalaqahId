import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Role, isKepalaRole } from "@/types/domain/enums";
import { Spinner } from "@/components/ui/spinner";
import { NoHalaqahView } from "@/features/halaqah/pages/NoHalaqah";
import { useFeature } from "@/lib/hooks/useFeature";

/** Spinner terpusat untuk saat auth sedang di-resolve */
export const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spinner className="w-8 h-8" />
  </div>
);

/**
 * Route guard: hanya bisa diakses oleh user yang SUDAH login.
 * Jika `allowedRoles` diberikan, juga cek apakah role user diizinkan.
 */
export const ProtectedRoute = ({
  allowedRoles,
  children,
}: {
  allowedRoles?: Role[];
  children?: React.ReactNode;
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === Role.SUPERADMIN)
      return <Navigate to="/superadmin" replace />;
    if (isKepalaRole(user.role))
      return <Navigate to="/kepala-muhafidz" replace />;
    if (user.role === Role.MUHAFIZ)
      return <Navigate to="/muhafidz" replace />;
    return <Navigate to="/login?reason=unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

/**
 * Route guard: hanya untuk tamu (belum login).
 * Jika sudah login, redirect ke halaman utama sesuai role.
 */
export const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (user) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

/** Redirect otomatis berdasarkan role setelah login */
export const RoleRedirect = () => {
  const { user } = useAuth();

  if (user?.role === Role.SUPERADMIN)
    return <Navigate to="/superadmin" replace />;
  if (user && isKepalaRole(user.role))
    return <Navigate to="/kepala-muhafidz" replace />;
  if (user?.role === Role.MUHAFIZ)
    return <Navigate to="/muhafidz" replace />;
  return <Navigate to="/login?reason=invalid_role" replace />;
};

/**
 * Guard khusus Muhafiz: jika belum punya halaqah, tampilkan NoHalaqahView.
 * Settings tetap bisa diakses (route settings ada di luar guard ini).
 */
export const MuhafizGuard = () => {
  const { user } = useAuth();

  if (user?.role === Role.MUHAFIZ && !user?.has_halaqah) {
    return <NoHalaqahView />;
  }

  return <Outlet />;
};

/**
 * Route guard: hanya bisa diakses jika tenant feature tertentu aktif.
 * Jika tidak aktif, redirect ke dashboard pengguna yang bersangkutan.
 */
export const FeatureRouteGuard = ({
  code,
  redirectTo,
  children,
}: {
  code: string;
  redirectTo?: string;
  children?: React.ReactNode;
}) => {
  const enabled = useFeature(code);
  const { user } = useAuth();

  if (!enabled) {
    const fallbackPath =
      redirectTo ||
      (user?.role === Role.SUPERADMIN
        ? "/superadmin"
        : user && isKepalaRole(user.role)
        ? "/kepala-muhafidz"
        : "/muhafidz");
    return <Navigate to={fallbackPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
