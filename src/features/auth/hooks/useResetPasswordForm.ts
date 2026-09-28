import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  resetPasswordPublicSchema,
  type ResetPasswordPublicFormValues,
} from "../validation/auth.schema";
import { useResetPasswordPublic } from "../api/mutations/useResetPasswordPublic";
import { getErrorMessage } from "@/utils/error";

export function useResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [backendError, setBackendError] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);

  const resetMutation = useResetPasswordPublic();

  const form = useForm<ResetPasswordPublicFormValues>({
    resolver: zodResolver(resetPasswordPublicSchema),
    defaultValues: {
      password_baru: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordPublicFormValues) => {
    if (!token) {
      setBackendError("Token reset password tidak ditemukan. Silakan gunakan link dari email Anda.");
      return;
    }

    setBackendError("");
    try {
      await resetMutation.mutateAsync({
        token,
        password_baru: values.password_baru,
      });

      setIsSuccess(true);
      toast.success("Password berhasil direset!");
      navigate("/login", {
        replace: true,
        state: {
          successMessage: "Password Anda berhasil diperbarui. Silakan masuk dengan password baru.",
        },
      });
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(
        error,
        "Gagal mereset password. Token mungkin sudah kedaluwarsa atau tidak valid."
      );
      setBackendError(errorMessage);
    }
  };

  const clearMessages = () => {
    if (backendError) setBackendError("");
  };

  return {
    form,
    token,
    hasToken: Boolean(token),
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    backendError,
    isSubmitting: resetMutation.isPending,
    isSuccess,
    onSubmit,
    clearMessages,
    navigate,
  };
}
