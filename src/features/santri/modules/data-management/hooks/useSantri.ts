import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSantriList, useCreateSantri, useUpdateSantri, useDeleteSantri } from "../../../api";
import { type Santri, type CreateSantriData, type UpdateSantriData } from "@/features/santri/types";
import { getErrorMessage } from "@/utils/error";
import { useParams } from "react-router-dom";
import { useAuth } from "@/features/auth/components/auth-provider";

export const useSantri = () => {
  const { halaqahId } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const queryKey = ["santri", halaqahId, user?.id_user];

  const { data, isLoading: isLoadingSantri, error, refetch: loadSantri } = useSantriList(
    halaqahId,
    user?.id_user
  );
  
  const santriList = (data || []) as Santri[];

  const createMutation = useCreateSantri(() => queryClient.invalidateQueries({ queryKey }));
  const updateMutation = useUpdateSantri(() => queryClient.invalidateQueries({ queryKey }));
  const deleteMutation = useDeleteSantri(() => queryClient.invalidateQueries({ queryKey }));

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
    resetError: () => {},
    
    getSantriById: useCallback((id: number) => 
      santriList.find(s => s.id_santri === id), 
      [santriList]
    ),
  };
};
