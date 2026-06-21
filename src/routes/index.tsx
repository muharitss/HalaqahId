import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import VerifyEmailPage from "@/features/auth/pages/VerifyEmailPage";
import KepalaMuhafidzRoot from "@/layouts/KepalaMuhafidzRoot";
import MuhafidzPage from "@/layouts/MuhafidzRoot"; 
import SuperadminRoot from "@/layouts/SuperadminRoot";
import { useAuth } from "@/features/auth/context/AuthContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Spinner } from "@/components/ui/spinner";
import SettingsPage from "@/features/settings/pages";
import LaporanSetoranPage from "@/features/setoran"; 
import InfoSection from "@/features/settings/pages/InfoSection";
import TrashSection from "@/features/settings/pages/TrashSection";
import ProfilSekolahPage from "@/features/sekolah";
import { DisplayProvider } from "@/features/display/context/DisplayContext";
import PublicDisplay from "@/features/display/pages/PublicDisplay";
import SantriDetail from "@/features/display/pages/SantriDetail";
import { TahfidzAi } from "@/features/tahfidz-ai/components/TahfidzAi";
import KelolaMuhafizPage from "@/features/muhafiz";
import KelolaHalaqahPage from "@/features/halaqah";
import KelolaSesiPage from "@/features/halaqah";
import AbsensiPage from "@/features/absensi";
import SetoranPage from "@/features/setoran";
import ProgresSantriPage from "@/features/santri";
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
      <Route 
        path="/verify-email" 
        element={<VerifyEmailPage />} 
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
            <Route path="/kepala-muhafidz/profil-sekolah" element={<ProfilSekolahPage />} />


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