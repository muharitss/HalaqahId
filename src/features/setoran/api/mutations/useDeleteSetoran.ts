import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setoranService } from "../services/setoranService";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";

export function useDeleteSetoran() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => setoranService.deleteSetoran(id),
    onSuccess: (data) => {
      toast.success(data.message || "Setoran berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["setoran-history"] });
      queryClient.invalidateQueries({ queryKey: ["setoran-history-local"] });
      queryClient.invalidateQueries({ queryKey: ["all-setoran"] });
      queryClient.invalidateQueries({ queryKey: ["laporan-data"] });
      queryClient.invalidateQueries({ queryKey: ["progres"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal menghapus setoran"));
    },
  });

  const deleteSetoran = async (id: number) => {
    try {
      await mutation.mutateAsync(id);
      return { success: true };
    } catch {
      return { success: false };
    }
  };

  return {
    deleteSetoran,
    isPending: mutation.isPending,
  };
}