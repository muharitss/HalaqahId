import { useMutation, useQueryClient } from "@tanstack/react-query";
import { santriWaliService } from "../services/santriWaliService";
import { santriWaliKeys } from "../queries/useSantriWaliList";

export function useDeleteSantriWali(santriId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (waliId: number) => santriWaliService.deleteWali(santriId, waliId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: santriWaliKeys.list(santriId) });
      onSuccess?.();
    },
  });
}
