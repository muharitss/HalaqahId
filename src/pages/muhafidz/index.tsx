import { Routes, Route } from "react-router-dom";
import SetoranPage from "./setoran";
// import DashboardMuhafidz from "./DashboardMuhafidz"; 

export default function MuhafidzPage() {
  return (
    <Routes>
      {/* Halaman Utama Muhafidz: Daftar Santri & Ringkasan */}
      <Route path="/setoran" element={<SetoranPage />} />
      
      {/* Halaman Form Setoran spesifik santri */}
      <Route path="setoran/:santriId" element={<div>Halaman Form Setoran (Coming Soon)</div>} />
      
      {/* Halaman Riwayat */}
      <Route path="riwayat" element={<div>Halaman Riwayat (Coming Soon)</div>} />
    </Routes>
  );
}