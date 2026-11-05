import { useState } from "react";
import { usePortalContext } from "../store/portal-context";
import {
  usePortalSantri,
  usePortalProgress,
  usePortalSetoran,
  usePortalAbsensi,
  usePortalUjian,
} from "../api/queries/usePortalQueries";

export function usePortal() {
  const { session, token, isAuthenticated, isLoadingSession, logout, login } = usePortalContext();

  const [setoranPage, setSetoranPage] = useState(1);
  const [absensiPage, setAbsensiPage] = useState(1);

  const santriQuery = usePortalSantri(isAuthenticated);
  const progressQuery = usePortalProgress(isAuthenticated);
  const setoranQuery = usePortalSetoran(setoranPage, 15, isAuthenticated);
  const absensiQuery = usePortalAbsensi(absensiPage, 20, isAuthenticated);
  const ujianQuery = usePortalUjian(isAuthenticated);

  return {
    // Auth & Session
    session,
    token,
    isAuthenticated,
    isLoadingSession,
    logout,
    login,

    // Queries
    santri: santriQuery.data,
    isLoadingSantri: santriQuery.isLoading,
    santriError: santriQuery.error,

    progress: progressQuery.data,
    isLoadingProgress: progressQuery.isLoading,
    refetchProgress: progressQuery.refetch,

    setoran: setoranQuery.data,
    isLoadingSetoran: setoranQuery.isLoading,
    setoranPage,
    setSetoranPage,

    absensi: absensiQuery.data,
    isLoadingAbsensi: absensiQuery.isLoading,
    absensiPage,
    setAbsensiPage,

    ujian: ujianQuery.data,
    isLoadingUjian: ujianQuery.isLoading,
  };
}

export { usePortalContext } from "../store/portal-context";
