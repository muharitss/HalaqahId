import { lazy } from "react";
import { type RouteObject } from "react-router-dom";
import { MuhafizGuard } from "./guards";

const MuhafizDashboard = lazy(() =>
  import("@/features/dashboard/pages/muhafiz-dashboard").then((m) => ({ default: m.MuhafizDashboard }))
);
const AbsensiPage = lazy(() => import("@/features/absensi/pages/AbsensiPage"));
const SetoranPage = lazy(() =>
  import("@/features/setoran/pages/input-setoran-page").then((m) => ({ default: m.InputSetoranPage }))
);
const MushafPage = lazy(() =>
  import("@/features/setoran/pages/mushaf-page").then((m) => ({ default: m.MushafPage }))
);
const LeaderboardPage = lazy(() =>
  import("@/features/setoran/pages/LeaderboardPage").then((m) => ({ default: m.LeaderboardPage }))
);
const KelolaSantriPage = lazy(() =>
  import("@/features/santri/pages/kelola-santri-page").then((m) => ({ default: m.KelolaSantriPage }))
);
const ProgresSantriPage = lazy(() =>
  import("@/features/santri/pages/progres-santri-page").then((m) => ({ default: m.ProgresSantriPage }))
);
const TahfidzAi = lazy(() =>
  import("@/features/tahfidz-ai/components/TahfidzAi").then((m) => ({ default: m.TahfidzAi }))
);
const SettingsPage = lazy(() => import("@/features/settings/pages/index"));
const InfoPage = lazy(() => import("@/features/settings/pages/InfoPage"));
const ProfilMuhafizPage = lazy(() => import("@/features/profil/pages/index"));

export const muhafizRoutes: RouteObject[] = [
  // Route yang butuh halaqah aktif — guard akan tampilkan NoHalaqahView jika belum punya
  {
    element: <MuhafizGuard />,
    children: [
      { path: "/muhafidz", element: <MuhafizDashboard /> },
      { path: "/muhafidz/absensi", element: <AbsensiPage /> },
      { path: "/muhafidz/setoran", element: <SetoranPage /> },
      { path: "/muhafidz/setoran/mushaf", element: <MushafPage /> },
      { path: "/muhafidz/santri", element: <KelolaSantriPage /> },
      { path: "/muhafidz/progres", element: <ProgresSantriPage /> },
      { path: "/muhafidz/leaderboard", element: <LeaderboardPage role="muhafiz" /> },
      { path: "/muhafidz/tahfidzai", element: <TahfidzAi /> },
    ],
  },
  // Settings & Profil selalu bisa diakses meski belum punya halaqah
  { path: "/muhafidz/settings", element: <SettingsPage /> },
  { path: "/muhafidz/settings/info", element: <InfoPage /> },
  { path: "/muhafidz/profil", element: <ProfilMuhafizPage /> },
];
