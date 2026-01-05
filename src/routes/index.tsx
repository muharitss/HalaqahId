import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import KepalaMuhafidzPage from "@/pages/kepala-muhafidz"; 
import MuhafidzPage from "@/pages/muhafidz"; 
import { useAuth } from "@/context/AuthContext";

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
      {/* Route Login */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <LoginPage />} 
      />

      {/* Route Utama dengan Proteksi */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            {/* Logic Redirect berdasarkan Role */}
            {user?.role === "kepala_muhafidz" ? (
              <Navigate to="/kepala-muhafidz" replace />
            ) : (
              <Navigate to="/muhafidz" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Halaman-halaman Dashboard */}
      <Route 
        path="/kepala-muhafidz/*" 
        element={<ProtectedRoute><KepalaMuhafidzPage /></ProtectedRoute>}
      />
      
      <Route 
        path="/muhafidz/*" 
        element={<ProtectedRoute><MuhafidzPage /></ProtectedRoute>}
      />

      {/* Fallback jika route tidak ditemukan */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};