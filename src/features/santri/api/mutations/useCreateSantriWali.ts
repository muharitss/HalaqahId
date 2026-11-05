import { useMutation, useQueryClient } from "@tanstack/react-query";
import { santriWaliService } from "../services/santriWaliService";
import { santriWaliKeys } from "../queries/useSantriWaliList";
import type { CreateSantriWaliRequest, SantriWali } from "@/types/domain/santri-wali";

export function useCreateSantriWali(santriId: number, onSuccess?: (data: SantriWali) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSantriWaliRequest) =>
      santriWaliService.createWali(santriId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: santriWaliKeys.list(santriId) });
      onSuccess?.(data);
    },
  });
}
