import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { profileService } from "../services/profile.service";
import type { GantiPasswordFormValues } from "../../types";

export function useGantiPasswordMutation() {
  return useMutation({
    mutationFn: (values: GantiPasswordFormValues) => {
      if (values.password_baru !== values.konfirmasi_password) {
        throw new Error("Konfirmasi password baru tidak cocok.");
      }
      return profileService.gantiPassword({
        password_lama: values.password_lama,
        password_baru: values.password_baru,
      });
    },
    onSuccess: () => {
      toast.success("Password berhasil diubah!");
    },
    onError: (error: unknown) => {
      const msg = error instanceof Error ? error.message : "Gagal mengganti password";
      toast.error(msg);
    },
  });
}
