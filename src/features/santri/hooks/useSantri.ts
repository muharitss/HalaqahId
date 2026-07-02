import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { santriService } from "../api/santriService";
import { type Santri, type CreateSantriData, type UpdateSantriData } from "../types";
import { getErrorMessage } from "@/utils/error";
import { useParams } from "react-router-dom";

export const useSantri = () => {
  const { halaqahId } = useParams();
  const queryClient = useQueryClient();

  const queryKey = ["santri", halaqahId];

  const { data: santriList = [], isFetching: isLoadingSantri, error, refetch: loadSantri } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        let data: Santri[] = [];
        if (halaqahId) {
          data = await santriService.getByHalaqahId(Number(halaqahId));
        } else {
          data = await santriService.getAll();
        }
        return Array.isArray(data) ? data : [];
      } catch (err: unknown) {
        throw new Error(getErrorMessage(err, "Gagal memuat data santri"));
      }
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateSantriData) => santriService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: UpdateSantriData }) => santriService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => santriService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const createSantri = async (data: CreateSantriData) => {
    try {
      return await createMutation.mutateAsync(data);
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err, "Gagal menambah santri"));
    }
  };

  const updateSantri = async (id: number, data: UpdateSantriData) => {
    try {
      return await updateMutation.mutateAsync({ id, data });
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err, "Gagal memperbarui data santri"));
    }
  };

  const deleteSantri = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err: unknown) {
      throw new Error(getErrorMessage(err, "Gagal menghapus santri"));
    }
  };

  const isLoading = isLoadingSantri || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return {
    santriList,
    isLoading,
    error: error ? error.message : null,
    
    loadSantri,
    createSantri,
    updateSantri,
    deleteSantri,
    resetError: () => {}, // No-op since React Query manages error state, or can be omitted if not strictly needed
    
    getSantriById: useCallback((id: number) => 
      santriList.find(s => s.id_santri === id), 
      [santriList]
    ),
  };
};
