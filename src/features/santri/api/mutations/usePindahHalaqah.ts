import { useMutation, useQueryClient } from "@tanstack/react-query";
import { santriService } from "../services/santriService";
import { type PindahHalaqahRequest } from "../../types";

export function usePindahHalaqah(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PindahHalaqahRequest }) =>
      santriService.pindahHalaqah(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["santri", "riwayat-halaqah", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["santri"] });
      queryClient.invalidateQueries({ queryKey: ["halaqah-management"] });
      queryClient.invalidateQueries({ queryKey: ["halaqah"] });
      onSuccess?.();
    },
  });
}
