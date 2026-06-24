import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { sesiService } from "@/features/halaqah/api/sesiService";
import type { 
  CreateSesiHalaqahRequest, 
  UpdateSesiHalaqahRequest 
} from "@/types/domain/sesi-halaqah";
import axios from "axios";

export function useSesi() {
  const queryClient = useQueryClient();

  const { data: sesiList = [], isFetching: isLoadingSesi, refetch: fetchSesi } = useQuery({
    queryKey: ["sesi-halaqah"],
    queryFn: async () => {
      try {
        const response = await sesiService.getSesiHalaqah();
        return response.data || [];
      } catch (error) {
        let errorMessage = "Gagal mengambil sesi halaqah";
        if (axios.isAxiosError(error)) {
          errorMessage = error.response?.data?.message || error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
        throw error;
      }
    }
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateSesiHalaqahRequest) => sesiService.createSesi(payload),
    onSuccess: () => {
      toast.success("Sesi halaqah berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["sesi-halaqah"] });
    },
    onError: (error) => {
      toast.error(error.message || "Gagal membuat sesi halaqah");
    }
  });


  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number, payload: UpdateSesiHalaqahRequest }) => sesiService.updateSesi(id, payload),
    onSuccess: () => {
      toast.success("Sesi halaqah berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["sesi-halaqah"] });
    },
    onError: (error) => {
      toast.error(error.message || "Gagal memperbarui sesi halaqah");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => sesiService.deleteSesi(id),
    onSuccess: () => {
      toast.success("Sesi halaqah berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["sesi-halaqah"] });
    },
    onError: (error) => {
      toast.error(error.message || "Gagal menghapus sesi halaqah");
    }
  });

  const createSesi = async (payload: CreateSesiHalaqahRequest) => {
    try { await createMutation.mutateAsync(payload); return true; } catch { return false; }
  };


  const updateSesi = async (id: number, payload: UpdateSesiHalaqahRequest) => {
    try { await updateMutation.mutateAsync({ id, payload }); return true; } catch { return false; }
  };

  const deleteSesi = async (id: number) => {
    try { await deleteMutation.mutateAsync(id); return true; } catch { return false; }
  };

  const isLoading = isLoadingSesi || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return {
    sesiList,
    isLoading,
    fetchSesi,
    createSesi,
    updateSesi,
    deleteSesi,
  };
}
