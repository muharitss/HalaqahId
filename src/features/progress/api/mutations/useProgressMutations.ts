import { useMutation, useQueryClient } from "@tanstack/react-query";
import { progressService } from "../services/progressService";
import { progressKeys } from "../queries/useProgressQueries";
import type { UpdateProgressPayload } from "../../types";

export function useProgressMutations(santriId?: number) {
  const queryClient = useQueryClient();

  const invalidateProgress = () => {
    if (santriId) {
      queryClient.invalidateQueries({
        queryKey: progressKeys.santriAll(santriId),
      });
    } else {
      queryClient.invalidateQueries({ queryKey: progressKeys.all });
    }
  };

  const updateProgressMutation = useMutation({
    mutationFn: ({
      suratId,
      payload,
    }: {
      suratId: number;
      payload: UpdateProgressPayload;
    }) => {
      if (!santriId) throw new Error("Santri ID wajib ada");
      return progressService.updateProgress(santriId, suratId, payload);
    },
    onSuccess: invalidateProgress,
  });

  const backfillMutation = useMutation({
    mutationFn: () => {
      if (!santriId) throw new Error("Santri ID wajib ada");
      return progressService.backfill(santriId);
    },
    onSuccess: invalidateProgress,
  });

  return {
    updateProgressMutation,
    backfillMutation,
  };
}
