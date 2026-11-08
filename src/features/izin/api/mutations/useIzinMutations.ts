import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { izinService } from "../services/izinService";
import { izinKeys } from "../queries/izinQueryKeys";
import type { AjukanIzinRequest, ApprovalIzinRequest } from "../../types";

export function useIzinMutations() {
  const queryClient = useQueryClient();

  const invalidateIzinAndAbsensi = () => {
    queryClient.invalidateQueries({ queryKey: izinKeys.all });
    // Invalidate absensi cache because approving auto-generates/updates absensi records
    queryClient.invalidateQueries({ queryKey: ["absensi"] });
  };

  const ajukanIzinMutation = useMutation({
    mutationFn: (payload: AjukanIzinRequest) => izinService.ajukanIzin(payload),
    onSuccess: (res) => {
      invalidateIzinAndAbsensi();
      toast.success(res?.message || "Pengajuan izin berhasil dibuat");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Gagal mengajukan izin";
      toast.error(msg);
    },
  });

  const approveIzinMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload?: ApprovalIzinRequest }) =>
      izinService.approveIzin(id, payload),
    onSuccess: (res) => {
      invalidateIzinAndAbsensi();
      toast.success(res?.message || "Izin berhasil disetujui dan absensi otomatis diperbarui");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Gagal menyetujui izin";
      toast.error(msg);
    },
  });

  const rejectIzinMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload?: ApprovalIzinRequest }) =>
      izinService.rejectIzin(id, payload),
    onSuccess: (res) => {
      invalidateIzinAndAbsensi();
      toast.success(res?.message || "Izin berhasil ditolak");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Gagal menolak izin";
      toast.error(msg);
    },
  });

  return {
    ajukanIzinMutation,
    approveIzinMutation,
    rejectIzinMutation,
  };
}
