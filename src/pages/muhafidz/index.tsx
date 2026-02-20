import { Routes, Route, Navigate } from "react-router-dom";
import SetoranPage from "./Setoran";
import AbsensiPage from "./Absensi";
import KelolaSantriPage from "./KelolaSantri"; 
import ProgresSantriPage from "./ProgresSantri";
import SettingsPage from "../settings";
import InfoSection from "../settings/InfoSection";
import { NoHalaqahView } from "./NoHalaqah"; 

export default function MuhafidzPage() {
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
      <Route path="/setoran" element={<SetoranPage />} />
      <Route path="santri" element={<KelolaSantriPage />} />
      <Route path="progres" element={<ProgresSantriPage />} />

      <Route path="settings">
        <Route index element={<SettingsPage />} />
        <Route path="info" element={<InfoSection />} />
      </Route>

      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}