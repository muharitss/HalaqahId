import { Routes, Route, Navigate } from "react-router-dom";
import SuperadminDashboard from "@/features/dashboard";
import KelolaSekolahPage from "@/features/sekolah";

export default function SuperadminRoot() {
  return (
    <Routes>
      <Route index element={<SuperadminDashboard />} />
      <Route path="sekolah" element={<KelolaSekolahPage />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}
