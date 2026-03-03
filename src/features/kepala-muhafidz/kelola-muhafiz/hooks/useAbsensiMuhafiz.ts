// src/features/kepala-muhafidz/kelola-muhafiz/hooks/useAbsensiMuhafiz.ts
import { useState } from "react";
import { muhafizService, type AbsensiAsatidzPayload } from "../services/muhafizService";
import { toast } from "sonner";

export const useAbsensiMuhafiz = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitAbsensi = async (payload: AbsensiAsatidzPayload) => {
    setIsSubmitting(true);
    try {
      await muhafizService.catatAbsensiAsatidz(payload);
      toast.success("Absensi muhafiz berhasil dicatat");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitAbsensi, isSubmitting };
};