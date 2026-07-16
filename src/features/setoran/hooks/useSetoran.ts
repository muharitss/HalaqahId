import { useState, useCallback, useMemo } from "react";
import { useSantriSesi } from "../api/queries/useSantriSesi";
import { useSetoranHistory } from "../api/queries/useSetoranHistory";
import { useAllSetoran } from "../api/queries/useAllSetoran";
import { useCreateSetoran } from "../api/mutations/useCreateSetoran";
import { useUpdateSetoran } from "../api/mutations/useUpdateSetoran";
import { useDeleteSetoran } from "../api/mutations/useDeleteSetoran";

export function useSetoran() {
  const [selectedSantriId, setSelectedSantriId] = useState<number | null>(null);

  // Queries
  const {
    data: santriSesiData,
    isFetching: loadingSantri,
    refetch: fetchSantri,
  } = useSantriSesi();

  const { data: history = [], isFetching: loadingHistory } =
    useSetoranHistory(selectedSantriId);

  const {
    data: allSetoran = [],
    isFetching: loadingAll,
    refetch: fetchAllSetoran,
  } = useAllSetoran();

  // Mutations
  const { createSetoran: addSetoran, isPending: creating } =
    useCreateSetoran();
  const { updateSetoran, isPending: updating } = useUpdateSetoran();
  const { deleteSetoran, isPending: deleting } = useDeleteSetoran();

  // Actions
  const fetchSetoranBySantri = useCallback((santriId: number) => {
    setSelectedSantriId(santriId);
  }, []);

  // Loading state
  const loading = useMemo(
    () => loadingSantri || loadingHistory || loadingAll || creating || updating || deleting,
    [loadingSantri, loadingHistory, loadingAll, creating, updating, deleting]
  );

  return {
    // Data
    santriList: santriSesiData?.santriList || [],
    sesiList: santriSesiData?.sesiList || [],
    history,
    allSetoran,
    // Actions
    addSetoran,
    updateSetoran,
    deleteSetoran,
    fetchSantri,
    fetchAllSetoran,
    fetchSetoranBySantri,
    // State
    loading,
  };
}