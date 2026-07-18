import { useCatatAbsensiAsatidz } from "../../../api";
import { toast } from "sonner";
import type { CreateAbsensiMuhafizRequest } from "@/types";

export const useAbsensiMuhafiz = () => {
  const mutation = useCatatAbsensiAsatidz(
    () => {
      toast.success("Absensi muhafiz berhasil dicatat");
    },
    (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Gagal mencatat absensi");
    }
  );

  const submitAbsensi = async (payload: CreateAbsensiMuhafizRequest) => {
    try {
      await mutation.mutateAsync({
        id_user: payload.id_user,
        id_sesi: payload.id_sesi,
        status: payload.status,
        tanggal: payload.tanggal,
        keterangan: payload.keterangan || "",
      });
    } catch {
      // Error handled in onError
    }
  };

  return { submitAbsensi, isSubmitting: mutation.isPending };
};
