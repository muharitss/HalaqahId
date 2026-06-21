import { Routes, Route, Navigate } from "react-router-dom";
import AbsensiPage from "@/features/absensi";
import KelolaSantriPage from "@/features/santri";
import SetoranPage from "@/features/setoran";
import ProgresSantriPage from "@/features/santri"; // Tambahkan ini
import SettingsPage from "@/features/settings/pages";
import InfoSection from "@/features/settings/pages/InfoSection";
import { NoHalaqahView } from "@/features/halaqah/pages/NoHalaqah";
import { Role } from "@/types/domain/enums";

export default function MuhafidzRoot() {
  const userRaw = localStorage.getItem("user"); 
  const user = userRaw ? JSON.parse(userRaw) : null;

  if (user?.role === Role.MUHAFIZ && !user?.has_halaqah) {
    return (
      <Routes>
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NoHalaqahView />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route index element={<AbsensiPage />} />
      <Route path="setoran" element={<SetoranPage />} />
      <Route path="santri" element={<KelolaSantriPage />} />
      <Route path="progres" element={<ProgresSantriPage />} /> {/* Tambahkan ini */}

      <Route path="settings">
        <Route index element={<SettingsPage />} />
        <Route path="info" element={<InfoSection />} />
      </Route>

      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}