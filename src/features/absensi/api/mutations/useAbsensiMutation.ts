import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { absensiService } from "../services/absensiService";
import { type CreateAbsensiSantriRequest as AbsensiPayload } from "@/types/domain/absensi";
import { getErrorMessage } from "@/utils/error";
import { absensiKeys } from "../queries/queryKeys";
import { useAuth } from "@/features/auth";

export const useAbsensiMutation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const mutation = useMutation({
    mutationFn: async (payloads: AbsensiPayload[]) => {
      await Promise.all(payloads.map((p) => absensiService.catatAbsensi(p)));
    },
    onSuccess: (_, variables) => {
      toast.success("Berhasil menyimpan absensi");
      if (variables.length > 0) {
        const firstPayload = variables[0];
        queryClient.invalidateQueries({
          queryKey: absensiKeys.sesi(user?.id_user, firstPayload.id_sesi, firstPayload.tanggal),
        });
        queryClient.invalidateQueries({
          queryKey: absensiKeys.all(user?.id_user),
        });
      }
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Gagal menyimpan absensi"));
    },
  });

  return {
    submitAbsensiBulk: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
  };
};
