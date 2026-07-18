import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { absensiService } from "../services/absensiService";
import { getErrorMessage } from "@/utils/error";
import { absensiKeys } from "../queries/queryKeys";
import { type AbsensiStatusType, createAbsensiSantriSchema } from "../../validation/absensi.schema";
import { useAuth } from "@/features/auth";

export interface RekapCellPayload {
  id_santri: number;
  id_sesi: number;
  status: AbsensiStatusType;
  tanggal: string; // "yyyy-MM-dd"
  silent?: boolean; // jika true, onSuccess tidak memunculkan toast
}

export const useAbsensiRekapMutation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const mutation = useMutation({
    mutationFn: async (payload: RekapCellPayload) => {
      const validated = createAbsensiSantriSchema.parse({
        id_santri: payload.id_santri,
        id_sesi: payload.id_sesi,
        status: payload.status,
        tanggal: payload.tanggal,
        keterangan: "-",
      });
      return await absensiService.catatAbsensi(validated);
    },
    onSuccess: (_, variables) => {
      if (!variables.silent) {
        queryClient.invalidateQueries({ queryKey: absensiKeys.all(user?.id_user) });
        toast.success("Absensi berhasil diperbarui");
      }
    },
    onError: (err, variables) => {
      if (!variables.silent) {
        toast.error(getErrorMessage(err, "Gagal memperbarui absensi"));
      }
    },
  });

  return {
    updateCell: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    pendingVariables: mutation.variables,
  };
};
