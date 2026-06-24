import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { setoranService } from "../api/setoranService";
import { type SetoranPayload } from "../types";
import { getErrorMessage } from "@/utils/error";
import { toast } from "sonner";
import { sesiService } from "@/features/halaqah/api/sesiService";

export const useSetoran = () => {
  const queryClient = useQueryClient();
  const [selectedSantriId, setSelectedSantriId] = useState<number | null>(null);

  // Santri & Sesi (Manual Fetching initially)
  const { 
    data: santriSesiData, 
    isFetching: loadingSantri, 
    refetch: fetchSantri 
  } = useQuery({
    queryKey: ["santri-sesi"],
    queryFn: async () => {
      try {
        const resSantri = await setoranService.getSantriList();
        const resSesi = await sesiService.getSesiHalaqah();
        return {
          santriList: resSantri.data || [],
          sesiList: resSesi.data || [],
        };
      } catch (err: unknown) {
        console.error("Gagal mengambil daftar santri dan sesi:", err);
        toast.error(getErrorMessage(err, "Gagal memuat daftar santri dan sesi"));
        throw err;
      }
    },
    enabled: false,
  });

  // History per Santri
  const { 
    data: history = [], 
    isFetching: loadingHistory 
  } = useQuery({
    queryKey: ["setoran-history", selectedSantriId],
    queryFn: async () => {
      if (!selectedSantriId) return [];
      try {
        const res = await setoranService.getSetoranBySantri(selectedSantriId);
        return res.data || [];
      } catch (err: unknown) {
        console.error("Gagal mengambil riwayat santri:", err);
        toast.error(getErrorMessage(err, "Gagal memuat riwayat setoran santri"));
        throw err;
      }
    },
    enabled: !!selectedSantriId,
  });

  const fetchSetoranBySantri = useCallback((santriId: number) => {
    setSelectedSantriId(santriId);
  }, []);

  // Add Setoran
  const addSetoranMutation = useMutation({
    mutationFn: async (values: SetoranPayload) => {
      return await setoranService.createSetoran(values);
    },
    onSuccess: (data) => {
      toast.success(data.message || "Setoran berhasil dicatat");
      queryClient.invalidateQueries({ queryKey: ["setoran-history"] });
      queryClient.invalidateQueries({ queryKey: ["all-setoran"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal mencatat setoran"));
    }
  });

  const addSetoran = async (values: SetoranPayload) => {
    try {
      await addSetoranMutation.mutateAsync(values);
      return { success: true };
    } catch {
      return { success: false };
    }
  };

  // All Setoran (Manual Fetching)
  const { 
    data: allSetoran = [], 
    isFetching: loadingAll, 
    refetch: fetchAllSetoran 
  } = useQuery({
    queryKey: ["all-setoran"],
    queryFn: async () => {
      try {
        const res = await setoranService.getAllSetoran();
        return res.data || [];
      } catch (err: unknown) {
        toast.error(getErrorMessage(err, "Gagal mengambil semua data setoran"));
        throw err;
      }
    },
    enabled: false,
  });

  const loading = loadingSantri || loadingHistory || addSetoranMutation.isPending || loadingAll;

  return { 
    addSetoran, 
    history, 
    santriList: santriSesiData?.santriList || [], 
    sesiList: santriSesiData?.sesiList || [],
    fetchSantri, 
    loading,
    allSetoran,
    fetchAllSetoran,
    fetchSetoranBySantri 
  };
};
