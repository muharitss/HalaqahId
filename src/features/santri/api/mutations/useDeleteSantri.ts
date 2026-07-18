import { useMutation } from "@tanstack/react-query";
import { santriService } from "../services/santriService";

export function useDeleteSantri(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (id: number) => santriService.delete(id),
    onSuccess,
  });
}
