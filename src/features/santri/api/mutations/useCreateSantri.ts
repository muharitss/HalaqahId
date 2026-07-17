import { useMutation } from "@tanstack/react-query";
import { santriService } from "../services/santriService";
import { type CreateSantriData } from "../../types";

export function useCreateSantri(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (data: CreateSantriData) => santriService.create(data),
    onSuccess,
  });
}
