import { useMutation, useQueryClient } from "@tanstack/react-query";
import { santriService } from "../services/santriService";
import { type NaikLevelRequest } from "../../types";

export function useNaikLevel(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: NaikLevelRequest }) =>
      santriService.naikLevel(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["santri", "riwayat-akademik", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["santri"] });
      onSuccess?.();
    },
  });
}
