import { useMutation } from "@tanstack/react-query";
import { muhafizService } from "../services/muhafizService";

export interface BulkCatatPayload {
  id_user: number;
  id_sesi?: number;
  status: string;
  tanggal: string;
  keterangan: string;
}

export function useBulkCatatAbsensiAsatidz(
  onSuccess?: () => void,
  onError?: (err: unknown) => void
) {
  return useMutation({
    mutationFn: async (payloads: BulkCatatPayload[]) => {
      const promises = payloads.map((payload) =>
        muhafizService.catatAbsensiAsatidz(payload)
      );
      return await Promise.all(promises);
    },
    onSuccess,
    onError,
  });
}
