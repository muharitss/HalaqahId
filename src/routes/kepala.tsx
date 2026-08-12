import { lazy } from "react";
import { type RouteObject } from "react-router-dom";

const KepalaMuhafidzDashboard = lazy(() =>
  import("@/features/dashboard/pages/kepala-muhafidz-dashboard").then((m) => ({ default: m.KepalaMuhafidzDashboard }))
);
const KelolaMuhafizPage = lazy(() => import("@/features/muhafiz/pages/index"));
const KelolaHalaqahPage = lazy(() =>
  import("@/features/halaqah/pages/kelola-halaqah-page").then((m) => ({ default: m.KelolaHalaqahPage }))
);
const KelolaSesiPage = lazy(() =>
  import("@/features/halaqah/pages/kelola-sesi-page").then((m) => ({ default: m.KelolaSesiPage }))
);
const AbsensiPage = lazy(() => import("@/features/absensi/pages/AbsensiPage"));
const SetoranPage = lazy(() =>
  import("@/features/setoran/pages/input-setoran-page").then((m) => ({ default: m.InputSetoranPage }))
);
const LaporanSetoranPage = lazy(() =>
  import("@/features/setoran/pages/laporan-setoran-page").then((m) => ({ default: m.LaporanSetoranPage }))
);
const MushafPage = lazy(() =>
  import("@/features/setoran/pages/mushaf-page").then((m) => ({ default: m.MushafPage }))
);
const LeaderboardPage = lazy(() =>
  import("@/features/setoran/pages/LeaderboardPage").then((m) => ({ default: m.LeaderboardPage }))
);
const TahfidzAi = lazy(() =>
  import("@/features/tahfidz-ai/components/TahfidzAi").then((m) => ({ default: m.TahfidzAi }))
);
const ProfilSekolahPage = lazy(() => import("@/features/sekolah/pages/ProfilSekolahPage"));
const ProfilMuhafizPage = lazy(() => import("@/features/profil/pages/index"));
const SettingsPage = lazy(() => import("@/features/settings/pages/index"));
const InfoPage = lazy(() => import("@/features/settings/pages/InfoPage"));
const TrashPage = lazy(() => import("@/features/settings/pages/TrashPage"));
const KategoriSettingsPage = lazy(() => import("@/features/settings/pages/KategoriSettingsPage"));
const TargetSettingsPage = lazy(() => import("@/features/settings/pages/TargetSettingsPage"));
const UjianSettingsPage = lazy(() => import("@/features/settings/pages/UjianSettingsPage"));
const FormSetoranSettingsPage = lazy(() => import("@/features/settings/pages/FormSetoranSettingsPage"));
const ProgresSantriPage = lazy(() =>
  import("@/features/santri/pages/progres-santri-page").then((m) => ({ default: m.ProgresSantriPage }))
);

export const kepalaRoutes: RouteObject[] = [
  {
    path: "/kepala-muhafidz",
    element: <KepalaMuhafidzDashboard />,
  },
  {
    path: "/kepala-muhafidz/muhafiz",
    element: <KelolaMuhafizPage />,
  },
  {
    path: "/kepala-muhafidz/halaqah",
    element: <KelolaHalaqahPage />,
  },
  {
    path: "/kepala-muhafidz/sesi",
    element: <KelolaSesiPage />,
  },
  {
    path: "/kepala-muhafidz/absensi",
    element: <AbsensiPage />,
  },
  {
    path: "/kepala-muhafidz/setoran",
    element: <SetoranPage />,
  },
  {
    path: "/kepala-muhafidz/setoran/mushaf",
    element: <MushafPage />,
  },
  {
    path: "/kepala-muhafidz/laporan",
    element: <LaporanSetoranPage />,
  },
  {
    path: "/kepala-muhafidz/leaderboard",
    element: <LeaderboardPage role="admin" />,
  },
  {
    path: "/kepala-muhafidz/tahfidzai",
    element: <TahfidzAi />,
  },
  {
    path: "/kepala-muhafidz/profil-sekolah",
    element: <ProfilSekolahPage />,
  },
  {
    path: "/kepala-muhafidz/profil",
    element: <ProfilMuhafizPage />,
  },
  {
    path: "/kepala-muhafidz/settings",
    element: <SettingsPage />,
  },
  {
    path: "/kepala-muhafidz/settings/info",
    element: <InfoPage />,
  },
  {
    path: "/kepala-muhafidz/settings/trash",
    element: <TrashPage />,
  },
  {
    path: "/kepala-muhafidz/settings/kategori",
    element: <KategoriSettingsPage />,
  },
  {
    path: "/kepala-muhafidz/settings/target",
    element: <TargetSettingsPage />,
  },
  {
    path: "/kepala-muhafidz/settings/ujian",
    element: <UjianSettingsPage />,
  },
  {
    path: "/kepala-muhafidz/settings/form-setoran",
    element: <FormSetoranSettingsPage />,
  },

  // Kontrol per-halaqah
  {
    path: "/kepala-muhafidz/halaqah/:halaqahId/absensi",
    element: <AbsensiPage />,
  },
  {
    path: "/kepala-muhafidz/halaqah/:halaqahId/setoran",
    element: <SetoranPage />,
  },
  {
    path: "/kepala-muhafidz/halaqah/:halaqahId/progres",
    element: <ProgresSantriPage />,
  },
];
