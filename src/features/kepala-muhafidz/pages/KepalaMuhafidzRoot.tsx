import { Routes, Route, Navigate } from "react-router-dom";
import KepalaMuhafidzDashboard from "@/features/kepala-muhafidz/dashboard";
import KelolaMuhafizPage from "@/features/kepala-muhafidz/kelola-muhafiz";
import KelolaHalaqahPage from "@/features/kepala-muhafidz/kelola-halaqah";
import LaporanSetoranPage from "@/features/kepala-muhafidz/laporan-setoran";

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