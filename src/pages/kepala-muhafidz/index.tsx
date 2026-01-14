import { Routes, Route, Navigate } from "react-router-dom";
import KepalaMuhafidzDashboard from "./Dashboard";
import KelolaMuhafizPage from "./KelolaMuhafiz";
import KelolaHalaqahPage from "./KelolaHalaqah"; 

export default function KepalaMuhafidzPage() {
  return (
    <Routes>
      <Route index element={<KepalaMuhafidzDashboard />} />
      <Route path="muhafiz" element={<KelolaMuhafizPage />} />
      <Route path="halaqah" element={<KelolaHalaqahPage />} /> 
      <Route path="laporan" element={<div>Lihat Laporan</div>} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}