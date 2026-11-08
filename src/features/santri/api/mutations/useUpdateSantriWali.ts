import { useMutation, useQueryClient } from "@tanstack/react-query";
import { santriWaliService } from "../services/santriWaliService";
import { santriWaliKeys } from "../queries/useSantriWaliList";
import type { UpdateSantriWaliRequest, SantriWali } from "@/types/domain/santri-wali";

export function useUpdateSantriWali(santriId: number, onSuccess?: (data: SantriWali) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      waliId,
      data,
    }: {
      waliId: number;
      data: UpdateSantriWaliRequest;
    }) => santriWaliService.updateWali(santriId, waliId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: santriWaliKeys.list(santriId) });
      onSuccess?.(data);
    },
  });
}
