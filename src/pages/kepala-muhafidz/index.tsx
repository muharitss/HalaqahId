// FILE: ./pages/kepala-muhafidz/index.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import KepalaMuhafidzDashboard from "./Dashboard"; // Komponen dashboard khusus

export default function KepalaMuhafidzPage() {
  return (
    <Routes>
      <Route index element={<KepalaMuhafidzDashboard />} />
      {/* Tambahkan sub-routes lain jika diperlukan */}
      <Route path="muhafiz" element={<div>Kelola Muhafiz</div>} />
      <Route path="halaqah" element={<div>Kelola Halaqah</div>} />
      <Route path="laporan" element={<div>Lihat Laporan</div>} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}