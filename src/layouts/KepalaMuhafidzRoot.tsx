import { Routes, Route, Navigate } from "react-router-dom";
import { KepalaMuhafidzDashboard } from "@/features/dashboard";
import KelolaMuhafizPage from "@/features/muhafiz";
import { KelolaHalaqahPage } from "@/features/halaqah";
import { LaporanSetoranPage } from "@/features/setoran";

export default function KepalaMuhafidzRoot() {
  return (
    <Routes>
      <Route index element={<KepalaMuhafidzDashboard />} />
      <Route path="muhafiz" element={<KelolaMuhafizPage />} />
      <Route path="halaqah" element={<KelolaHalaqahPage />} /> 
      <Route path="laporan" element={<LaporanSetoranPage />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}
