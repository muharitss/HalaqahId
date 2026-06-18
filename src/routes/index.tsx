import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import KepalaMuhafidzRoot from "@/features/kepala-muhafidz/pages/KepalaMuhafidzRoot";
import MuhafidzPage from "@/features/muhafidz/pages/MuhafidzRoot"; 
import SuperadminRoot from "@/features/superadmin/pages/SuperadminRoot";
import { useAuth } from "@/features/auth/context/AuthContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Spinner } from "@/components/ui/spinner";
import SettingsPage from "@/pages/settings";
import LaporanSetoranPage from "@/features/kepala-muhafidz/laporan-setoran"; 
import InfoSection from "@/pages/settings/InfoSection";
import TrashSection from "@/pages/settings/TrashSection";
import { DisplayProvider } from "@/features/display/context/DisplayContext";
import PublicDisplay from "@/features/display/pages/PublicDisplay";
import SantriDetail from "@/features/display/pages/SantriDetail";
import { TahfidzAi } from "@/components/features/tahfidz-ai/TahfidzAi";
import KelolaMuhafizPage from "@/features/kepala-muhafidz/kelola-muhafiz";
import KelolaHalaqahPage from "@/features/kepala-muhafidz/kelola-halaqah";
import KelolaSesiPage from "@/features/kepala-muhafidz/kelola-sesi";
import AbsensiPage from "@/features/muhafidz/absensi";
import SetoranPage from "@/features/muhafidz/setoran";
import ProgresSantriPage from "@/features/muhafidz/progres-santri";
import { Role, isKepalaRole } from "@/types/domain/enums";


const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: Role[] }) => {
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
    if (user.role === Role.SUPERADMIN) return <Navigate to="/superadmin" replace />;
    return isKepalaRole(user.role)
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
        path="/display/:token" 
        element={
          <DisplayProvider>
            <PublicDisplay />
          </DisplayProvider>
        } 
      />
      <Route 
        path="/display/:token/santri/:id" 
        element={
          <DisplayProvider>
            <SantriDetail /> 
          </DisplayProvider>
        } 
      />
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <LoginPage />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/" replace /> : <RegisterPage />} 
      />

      {/* 🔒 Protected Routes: Membutuhkan Login */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          
          {/* Redirect berdasarkan role */}
          <Route
            index
            element={
              user?.role === Role.SUPERADMIN ? (
                <Navigate to="/superadmin" replace />
              ) : user && isKepalaRole(user.role) ? (
                <Navigate to="/kepala-muhafidz" replace />
              ) : (
                <Navigate to="/muhafidz" replace />
              )
            }
          />

          {/* Rute Khusus Superadmin */}
          <Route element={<ProtectedRoute allowedRoles={[Role.SUPERADMIN]} />}>
            <Route path="/superadmin/*" element={<SuperadminRoot />} />
          </Route>

          {/* Rute Khusus Kepala (Superadmin, Admin, Koordinator Tahfiz) */}
          <Route element={<ProtectedRoute allowedRoles={[Role.SUPERADMIN, Role.ADMIN, Role.KOORDINATOR_TAHFIZ]} />}>
            <Route path="/kepala-muhafidz" element={<KepalaMuhafidzRoot />} />
            <Route path="/kepala-muhafidz/muhafiz" element={<KelolaMuhafizPage />} />
            <Route path="/kepala-muhafidz/halaqah" element={<KelolaHalaqahPage />} />
            <Route path="/kepala-muhafidz/sesi" element={<KelolaSesiPage />} />
            <Route path="/kepala-muhafidz/settings" element={<SettingsPage/>} />
            <Route path="/kepala-muhafidz/settings/info" element={<InfoSection/>} />
            <Route path="/kepala-muhafidz/settings/trash" element={<TrashSection/>} />


            {/* Tambahkan route superadmin lainnya di sini */}
            <Route path="/kepala-muhafidz/laporan" element={<LaporanSetoranPage />} />
            <Route path="/kepala-muhafidz/absensi" element={<AbsensiPage />} />
            <Route path="/kepala-muhafidz/setoran" element={<SetoranPage />} />
            <Route path="/kepala-muhafidz/tahfidzai" element={<TahfidzAi />} />
            <Route path="/kepala-muhafidz/kontrol-halaqah/:halaqahId">
              <Route path="absensi" element={<AbsensiPage />} />
              <Route path="setoran" element={<SetoranPage />} />
              <Route path="progres" element={<ProgresSantriPage />} />
            </Route>
          </Route>

          {/* Rute Khusus Muhafidz */}
          <Route element={<ProtectedRoute allowedRoles={[Role.MUHAFIZ]} />}>
            <Route path="/muhafidz/tahfidzai" element={<TahfidzAi />} />
            <Route path="/muhafidz/*" element={<MuhafidzPage />} />
          </Route>

        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};