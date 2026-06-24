import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { absensiService } from "../api/absensiService";
import { type CreateAbsensiSantriRequest as AbsensiPayload } from "@/types/domain/absensi";
import { getErrorMessage } from "@/utils/error";
import { absensiKeys } from "./use-absensi-query";

export const useAbsensiMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payloads: AbsensiPayload[]) => {
      // Catat semua absensi secara parallel
      await Promise.all(payloads.map((p) => absensiService.catatAbsensi(p)));
    },
    onSuccess: (_, variables) => {
      toast.success("Berhasil menyimpan absensi");
      // Invalidasi cache berdasarkan sesi dan tanggal yang diupdate
      if (variables.length > 0) {
        const firstPayload = variables[0];
        queryClient.invalidateQueries({
          queryKey: absensiKeys.sesi(firstPayload.id_sesi, firstPayload.tanggal),
        });
        queryClient.invalidateQueries({
          queryKey: absensiKeys.all,
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
