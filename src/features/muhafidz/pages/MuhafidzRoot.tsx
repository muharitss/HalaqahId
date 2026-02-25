import { Routes, Route, Navigate } from "react-router-dom";
import AbsensiPage from "@/features/muhafidz/absensi";
import KelolaSantriPage from "@/features/muhafidz/kelola-santri";
import SetoranPage from "@/features/muhafidz/setoran";
import ProgresSantriPage from "@/features/muhafidz/progres-santri"; // Tambahkan ini
import SettingsPage from "@/pages/settings";
import InfoSection from "@/pages/settings/InfoSection";
import { NoHalaqahView } from "@/pages/muhafidz/NoHalaqah";

export default function MuhafidzRoot() {
  const userRaw = localStorage.getItem("user"); 
  const user = userRaw ? JSON.parse(userRaw) : null;

  if (user?.role === "muhafiz" && !user?.has_halaqah) {
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