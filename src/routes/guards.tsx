import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { Role, isKepalaRole } from "@/types/domain/enums";
import { Spinner } from "@/components/ui/spinner";
import { NoHalaqahView } from "@/features/halaqah";

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
export const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: Role[] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === Role.SUPERADMIN)
      return <Navigate to="/superadmin" replace />;
    return isKepalaRole(user.role) ? (
      <Navigate to="/kepala-muhafidz" replace />
    ) : (
      <Navigate to="/muhafidz" replace />
    );
  }

  return <Outlet />;
};

/**
 * Route guard: hanya untuk tamu (belum login).
 * Jika sudah login, redirect ke halaman utama sesuai role.
 */
export const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (user) return <Navigate to="/" replace />;

  return <>{children}</>;
};

/** Redirect otomatis berdasarkan role setelah login */
export const RoleRedirect = () => {
  const { user } = useAuth();

  if (user?.role === Role.SUPERADMIN)
    return <Navigate to="/superadmin" replace />;
  if (user && isKepalaRole(user.role))
    return <Navigate to="/kepala-muhafidz" replace />;
  return <Navigate to="/muhafidz" replace />;
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
