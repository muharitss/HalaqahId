import { Routes, Route, Navigate } from "react-router-dom";
import SetoranPage from "./Setoran";
import AbsensiPage from "./Absensi"; // Kita akan buat file ini

export default function MuhafidzPage() {
  return (
    <Routes>
      {/* Default redirect ke absensi atau setoran */}
      <Route index element={<AbsensiPage />} />
      
      <Route path="/setoran" element={<SetoranPage />} />
      
      {/* Halaman Form Setoran spesifik santri */}
      <Route path="setoran/:santriId" element={<div>Halaman Form Setoran (Coming Soon)</div>} />
      
      {/* Halaman Riwayat */}
      <Route path="riwayat" element={<div>Halaman Riwayat (Coming Soon)</div>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}