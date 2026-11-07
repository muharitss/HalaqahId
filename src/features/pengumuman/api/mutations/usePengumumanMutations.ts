import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { pengumumanService } from "../services/pengumumanService";
import { pengumumanKeys } from "../queries/usePengumumanQueries";
import type { CreatePengumumanPayload, UpdatePengumumanPayload } from "../../types";

export function usePengumumanMutations() {
  const queryClient = useQueryClient();

  const invalidatePengumuman = () => {
    queryClient.invalidateQueries({ queryKey: pengumumanKeys.all });
  };

  const createPengumumanMutation = useMutation({
    mutationFn: (payload: CreatePengumumanPayload) =>
      pengumumanService.createPengumuman(payload),
    onSuccess: () => {
      invalidatePengumuman();
      toast.success("Pengumuman berhasil dibuat");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Gagal membuat pengumuman";
      toast.error(msg);
    },
  });

  const updatePengumumanMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdatePengumumanPayload;
    }) => pengumumanService.updatePengumuman(id, payload),
    onSuccess: (_, variables) => {
      invalidatePengumuman();
      queryClient.invalidateQueries({
        queryKey: pengumumanKeys.detail(variables.id),
      });
      toast.success("Pengumuman berhasil diperbarui");
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Gagal memperbarui pengumuman";
      toast.error(msg);
    },
  });

  const deletePengumumanMutation = useMutation({
    mutationFn: (id: number) => pengumumanService.deletePengumuman(id),
    onSuccess: () => {
      invalidatePengumuman();
      toast.success("Pengumuman berhasil dihapus");
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Gagal menghapus pengumuman";
      toast.error(msg);
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => pengumumanService.markAsRead(id),
    onSuccess: (_, id) => {
      invalidatePengumuman();
      queryClient.invalidateQueries({ queryKey: pengumumanKeys.detail(id) });
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal menandai pengumuman sudah dibaca";
      toast.error(msg);
    },
  });

  const togglePinMutation = useMutation({
    mutationFn: ({ id, is_pinned }: { id: number; is_pinned: boolean }) =>
      pengumumanService.updatePengumuman(id, { is_pinned }),
    onSuccess: (_, variables) => {
      invalidatePengumuman();
      toast.success(
        variables.is_pinned
          ? "Pengumuman disematkan di atas"
          : "Sematkan pengumuman dibatalkan"
      );
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal mengubah status sematan pengumuman";
      toast.error(msg);
    },
  });

  return {
    createPengumumanMutation,
    updatePengumumanMutation,
    deletePengumumanMutation,
    markAsReadMutation,
    togglePinMutation,
  };
}
