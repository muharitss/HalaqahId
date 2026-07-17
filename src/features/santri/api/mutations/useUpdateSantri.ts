import { useMutation } from "@tanstack/react-query";
import { santriService } from "../services/santriService";
import { type UpdateSantriData } from "../../types";

export function useUpdateSantri(onSuccess?: () => void) {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSantriData }) =>
      santriService.update(id, data),
    onSuccess,
  });
}
