import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import KepalaMuhafidzDashboard from "@/pages/kepala-muhafidz/Dashboard"; // Ganti dengan path yang benar
import MuhafidzPage from "@/pages/muhafidz"; 
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Spinner } from "@/components/ui/spinner";
import KelolaAkunPage from "@/pages/kepala-muhafidz/KelolaMuhafiz";
// import { useEffect } from "react";

const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: ("superadmin" | "muhafiz")[] }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // useEffect(() => {
  //   // Selalu validasi token ke backend setiap kali pindah URL
  //   const checkTokenRealtime = async () => {
  //     if (localStorage.getItem("user")) {
  //       await refreshUser();
  //     }
  //   };
  //   checkTokenRealtime();
  // }, [location.pathname, refreshUser]);

  if (isLoading) {
    return <Spinner />;
  }

  // Jika tidak ada user (atau token habis setelah refreshUser gagal), tendang ke login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika role tidak diizinkan, kembalikan ke root (yang nanti akan me-redirect ke dashboard masing-masing)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; 
  }

  return <Outlet />;
};

export const AppRouter = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* 🔓 Public Route: Login */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <LoginPage />} 
      />

      {/* 🔒 Protected Routes: Membutuhkan Login */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          
          {/* 1. Entry Point: Redirect berdasarkan role */}
          <Route
            path="/"
            element={
              user?.role === "superadmin" ? (
                <Navigate to="/kepala-muhafidz" replace />
              ) : (
                <Navigate to="/muhafidz" replace />
              )
            }
          />

          {/* 2. Rute Khusus Superadmin (Kepala Muhafidz) */}
          <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
            <Route path="/kepala-muhafidz" element={<KepalaMuhafidzDashboard />} />
            {/* Jika Anda ingin punya sub-routes untuk superadmin */}
            <Route path="/kepala-muhafidz/*" element={<div>Sub-routes for superadmin</div>} />
          </Route>

          {/* 3. Rute Khusus Muhafidz */}
          <Route element={<ProtectedRoute allowedRoles={["muhafiz"]} />}>
            <Route path="/muhafidz/*" element={<MuhafidzPage />} />
          </Route>

        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};