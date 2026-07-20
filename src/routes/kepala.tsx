import { type RouteObject } from "react-router-dom";
import { KepalaMuhafidzDashboard } from "@/features/dashboard";
import KelolaMuhafizPage from "@/features/muhafiz";
import {
  KelolaHalaqahPage,
  KelolaSesiPage,
} from "@/features/halaqah";
import { AbsensiPage } from "@/features/absensi";
import {
  SetoranPage,
  LaporanSetoranPage,
  MushafPage,
  LeaderboardPage,
} from "@/features/setoran";
import { TahfidzAi } from "@/features/tahfidz-ai";
import { ProfilSekolahPage } from "@/features/sekolah";
import { ProfilMuhafizPage } from "@/features/profil";
import SettingsPage, {
  InfoPage,
  TrashPage,
  KategoriSettingsPage,
  TargetSettingsPage,
  UjianSettingsPage,
  FormSetoranSettingsPage,
} from "@/features/settings";
import { ProgresSantriPage } from "@/features/santri";

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
