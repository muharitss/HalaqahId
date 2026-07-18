import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setoranService } from "../services/setoranService";
import { type SetoranPayload } from "../../types";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";

export function useCreateSetoran() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: SetoranPayload) =>
      setoranService.createSetoran(values),
    onSuccess: (data) => {
      toast.success(data.message || "Setoran berhasil dicatat");
      queryClient.invalidateQueries({ queryKey: ["setoran-history"] });
      queryClient.invalidateQueries({ queryKey: ["all-setoran"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal mencatat setoran"));
    },
  });

  const createSetoran = async (values: SetoranPayload) => {
    try {
      await mutation.mutateAsync(values);
      return { success: true };
    } catch {
      return { success: false };
    }
  };

  return {
    createSetoran,
    isPending: mutation.isPending,
  };
}