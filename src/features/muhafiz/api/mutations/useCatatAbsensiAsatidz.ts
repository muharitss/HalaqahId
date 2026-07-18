import { useMutation } from "@tanstack/react-query";
import { muhafizService } from "../services/muhafizService";

export function useCatatAbsensiAsatidz(
  onSuccess?: (data: any, variables: any) => void,
  onError?: (err: unknown) => void
) {
  return useMutation({
    mutationFn: async (payload: {
      id_user: number;
      id_sesi?: number;
      status: string;
      tanggal: string;
      keterangan: string;
    }) => {
      return await muhafizService.catatAbsensiAsatidz(payload);
    },
    onSuccess,
    onError,
  });
}
