// FILE: ./routes/index.tsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import KepalaMuhafidzDashboard from "@/pages/kepala-muhafidz/Dashboard";
import MuhafidzPage from "@/pages/muhafidz"; 
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Spinner } from "@/components/ui/spinner";
import KelolaMuhafizPage from "@/pages/kepala-muhafidz/KelolaMuhafiz";
import KelolaHalaqahPage from "@/pages/kepala-muhafidz/KelolaHalaqah";
import SettingsPage from "@/pages/settings";

const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: ("superadmin" | "muhafiz")[] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  // Jika tidak ada user (atau token habis), tendang ke login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Jika role tidak diizinkan, kembalikan ke dashboard sesuai role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return user.role === "superadmin" 
      ? <Navigate to="/kepala-muhafidz" replace />
      : <Navigate to="/muhafidz" replace />;
  }

  return <Outlet />;
};

export const AppRouter = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

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
          
          {/* Redirect berdasarkan role */}
          <Route
            index
            element={
              user?.role === "superadmin" ? (
                <Navigate to="/kepala-muhafidz" replace />
              ) : (
                <Navigate to="/muhafidz" replace />
              )
            }
          />

          {/* Rute Khusus Superadmin (Kepala Muhafidz) */}
          <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
            <Route path="/kepala-muhafidz" element={<KepalaMuhafidzDashboard />} />
            <Route path="/kepala-muhafidz/muhafiz" element={<KelolaMuhafizPage />} />
            <Route path="/kepala-muhafidz/halaqah" element={<KelolaHalaqahPage />} />
            <Route path="/kepala-muhafidz/settings" element={<SettingsPage/>} />
            {/* Tambahkan route superadmin lainnya di sini */}
            <Route path="/kepala-muhafidz/*" element={<div>Sub-routes for superadmin</div>} />
          </Route>

          {/* Rute Khusus Muhafidz */}
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