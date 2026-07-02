// src/features/kepala-muhafidz/kelola-muhafiz/hooks/useAbsensiMuhafiz.ts
import { useMutation } from "@tanstack/react-query";
import { muhafizService } from "../api/muhafizService";
import { toast } from "sonner";
import type { CreateAbsensiMuhafizRequest } from "@/types";

export const useAbsensiMuhafiz = () => {
  const mutation = useMutation({
    mutationFn: (payload: CreateAbsensiMuhafizRequest) => 
      muhafizService.catatAbsensiAsatidz({ ...payload, keterangan: payload.keterangan || "" }),
    onSuccess: () => {
      toast.success("Absensi muhafiz berhasil dicatat");
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Gagal mencatat absensi");
    }
  });

  const submitAbsensi = async (payload: CreateAbsensiMuhafizRequest) => {
    try {
      await mutation.mutateAsync(payload);
    } catch {
      // Error handled in onError
    }
  };

  return { submitAbsensi, isSubmitting: mutation.isPending };
};
