import { Routes, Route, Navigate } from "react-router-dom";
import SetoranPage from "./Setoran";
import AbsensiPage from "./Absensi";
import KelolaSantriPage from "./KelolaSantri"; 
import ProgresSantriPage from "./ProgresSantri";
import SettingsPage from "../settings";
import InfoSection from "../settings/InfoSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function MuhafidzPage() {
  const { user } = useAuth();

  const hasNoHalaqah = user?.role === "muhafiz" && !user?.id_halaqah;

  return (
    <Routes>
      {hasNoHalaqah ? (
        <>
          <Route index element={<NoHalaqahState />} />
          <Route path="/setoran" element={<NoHalaqahState />} />
          <Route path="santri" element={<NoHalaqahState />} />
          <Route path="progres" element={<NoHalaqahState />} />
        </>
      ) : (
        <>
          <Route index element={<AbsensiPage />} />
          <Route path="/setoran" element={<SetoranPage />} />
          <Route path="santri" element={<KelolaSantriPage />} />
          <Route path="progres" element={<ProgresSantriPage />} />
        </>
      )}

      <Route path="settings">
        <Route index element={<SettingsPage />} />
        <Route path="info" element={<InfoSection />} />
      </Route>

      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}

function NoHalaqahState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-4 border-dashed border-2">
        <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-600 h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Halaqah Belum Ditugaskan</h2>
          <p className="text-muted-foreground text-sm">
            Akun Anda saat ini belum dikaitkan dengan halaqah mana pun. 
            Silakan hubungi <b>Kepala Muhafidz</b> untuk penugasan halaqah agar Anda dapat menginput data setoran dan absensi.
          </p>
        </div>
      </Card>
    </div>
  );
}