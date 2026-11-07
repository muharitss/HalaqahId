import { useMutation, useQueryClient } from "@tanstack/react-query";
import { santriService } from "../services/santriService";
import { type BatchNaikTahunRequest, type BatchNaikTahunResponse } from "../../types";

export function useBatchNaikTahun(onSuccess?: (result: BatchNaikTahunResponse) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BatchNaikTahunRequest) => santriService.batchNaikTahun(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["santri"] });
      queryClient.invalidateQueries({ queryKey: ["akademik"] });
      queryClient.invalidateQueries({ queryKey: ["halaqah"] });
      onSuccess?.(result);
    },
  });
}
