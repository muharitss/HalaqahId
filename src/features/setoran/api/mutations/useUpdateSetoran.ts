import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setoranService } from "../services/setoranService";
import { type SetoranPayload } from "../../types";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";

export function useUpdateSetoran() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: Partial<SetoranPayload>;
    }) => setoranService.updateSetoran(id, values),
    onSuccess: (data) => {
      toast.success(data.message || "Setoran berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["setoran-history"] });
      queryClient.invalidateQueries({ queryKey: ["setoran-history-local"] });
      queryClient.invalidateQueries({ queryKey: ["all-setoran"] });
      queryClient.invalidateQueries({ queryKey: ["laporan-data"] });
      queryClient.invalidateQueries({ queryKey: ["progres"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal memperbarui setoran"));
    },
  });

  const updateSetoran = async (
    id: number,
    values: Partial<SetoranPayload>
  ) => {
    try {
      await mutation.mutateAsync({ id, values });
      return { success: true };
    } catch {
      return { success: false };
    }
  };

  return {
    updateSetoran,
    isPending: mutation.isPending,
  };
}