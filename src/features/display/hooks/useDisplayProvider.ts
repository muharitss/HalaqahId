import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSantriList } from "../api";
import { type DisplaySantri } from "../types";

export function useDisplayProvider() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, refetch } = useSantriList(slug);

  const santriList = useMemo((): DisplaySantri[] => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  const refreshSantri = async () => {
    await refetch();
  };

  return {
    santriList,
    isLoading,
    refreshSantri,
  };
}
