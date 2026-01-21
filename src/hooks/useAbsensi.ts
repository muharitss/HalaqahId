import { useState } from "react";
import { absensiService, type AbsensiPayload } from "@/services/absensiService";
import { toast } from "sonner";

export const useAbsensi = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitAbsensiBulk = async (payloads: AbsensiPayload[]) => {
    setIsSubmitting(true);
    try {
      await Promise.all(payloads.map(p => absensiService.catatAbsensi(p)));
      toast.success("Berhasil menyimpan semua absensi");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyimpan absensi");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitAbsensiBulk, isSubmitting };
};