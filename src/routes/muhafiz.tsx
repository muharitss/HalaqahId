import { type RouteObject } from "react-router-dom";
import { MuhafizDashboard } from "@/features/dashboard";
import { AbsensiPage } from "@/features/absensi";
import { SetoranPage, MushafPage, LeaderboardPage } from "@/features/setoran";
import { KelolaSantriPage, ProgresSantriPage } from "@/features/santri";
import { TahfidzAi } from "@/features/tahfidz-ai";
import SettingsPage, { InfoPage } from "@/features/settings";
import { ProfilMuhafizPage } from "@/features/profil";
import { MuhafizGuard } from "./guards";

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
