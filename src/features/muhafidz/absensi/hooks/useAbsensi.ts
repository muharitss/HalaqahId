import { useState } from "react";
import { toast } from "sonner";
import { absensiService } from "../services/absensiService";
import { type AbsensiPayload } from "../types";
import { getErrorMessage } from "@/utils/error";
export const useAbsensi = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitAbsensiBulk = async (payloads: AbsensiPayload[]) => {
    setIsSubmitting(true);
    try {
      await Promise.all(payloads.map(p => absensiService.catatAbsensi(p)));
      toast.success("Berhasil menyimpan semua absensi");
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menyimpan absensi"));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitAbsensiBulk, isSubmitting };
};