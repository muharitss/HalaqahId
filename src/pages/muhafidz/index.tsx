import { Routes, Route, Navigate } from "react-router-dom";
import SetoranPage from "./Setoran";
import AbsensiPage from "./Absensi"; 
import KelolaSantriPage from "./KelolaSantri"; 
import ProgresSantriPage from "./ProgresSantri";

export default function MuhafidzPage() {
  return (
    <Routes>
      {/* Default redirect ke absensi atau setoran */}
      <Route index element={<AbsensiPage />} />
      
      <Route path="/setoran" element={<SetoranPage />} />
      
      <Route path="santri" element={<KelolaSantriPage />} />

      <Route path="progres" element={<ProgresSantriPage />} />
      
      {/* Halaman Riwayat */}
      <Route path="riwayat" element={<div>Halaman Riwayat (Coming Soon)</div>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}