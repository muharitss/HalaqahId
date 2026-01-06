import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import KepalaMuhafidzPage from "@/pages/kepala-muhafidz"; 
import MuhafidzPage from "@/pages/muhafidz"; 
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import AbsensiPage from "@/pages/muhafidz/absensi";

// Komponen Pembatas (Hanya yang sudah login yang boleh lewat)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export const AppRouter = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <LoginPage />} 
      />

      {/* Gunakan DashboardLayout sebagai Wrapper untuk semua rute internal */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Logic Redirect awal */}
        <Route
          path="/"
          element={
            user?.role === "kepala_muhafidz" ? (
              <Navigate to="/kepala-muhafidz" replace />
            ) : (
              <Navigate to="/muhafidz" replace />
            )
          }
        />

        {/* Semua Route di bawah ini akan otomatis punya Sidebar & Header */}
        <Route path="/kepala-muhafidz/*" element={<KepalaMuhafidzPage />} />
        <Route path="/muhafidz/" element={<MuhafidzPage />}>
          {/* <Route path="/muhafidz/absensi" element={<AbsensiPage />} /> */}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};