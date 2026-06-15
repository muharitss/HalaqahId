// src/features/kepala-muhafidz/kelola-muhafiz/hooks/useAbsensiMuhafiz.ts
import { useState } from "react";
import { muhafizService } from "../services/muhafizService";
import { toast } from "sonner";
import type { CreateAbsensiMuhafizRequest } from "@/types";

export const useAbsensiMuhafiz = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitAbsensi = async (payload: CreateAbsensiMuhafizRequest) => {
    setIsSubmitting(true);
    try {
      await muhafizService.catatAbsensiAsatidz({ ...payload, keterangan: payload.keterangan || "" });
      toast.success("Absensi muhafiz berhasil dicatat");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitAbsensi, isSubmitting };
};