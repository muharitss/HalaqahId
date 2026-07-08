import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { absensiService } from "../api/absensiService";
import { type CreateAbsensiSantriRequest as AbsensiPayload } from "@/types/domain/absensi";
import { getErrorMessage } from "@/utils/error";
import { absensiKeys } from "./use-absensi-query";
import { type AbsensiStatusType } from "../types/absensi.schema";
import { useAuth } from "@/features/auth/components/auth-provider";

export const useAbsensiMutation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

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

/**
 * Mutation untuk inline editing langsung di tabel rekap bulanan.
 * Mendukung upsert (POST /absensi akan update jika sudah ada, create jika belum).
 */
export interface RekapCellPayload {
  id_santri: number;
  id_sesi: number;
  status: AbsensiStatusType;
  tanggal: string; // "yyyy-MM-dd"
}

export const useAbsensiRekapMutation = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const mutation = useMutation({
    mutationFn: async (payload: RekapCellPayload) => {
      return await absensiService.catatAbsensi({
        id_santri: payload.id_santri,
        id_sesi: payload.id_sesi,
        status: payload.status,
        tanggal: payload.tanggal,
        keterangan: "-",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: absensiKeys.all(user?.id_user) });
      toast.success("Absensi berhasil diperbarui");
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Gagal memperbarui absensi"));
    },
  });

  return {
    updateCell: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    pendingVariables: mutation.variables,
  };
};
