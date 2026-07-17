import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { loginSchema, type LoginFormValues } from "../validation/auth.schema";
import { useAuth } from "../components/auth-provider";
import { getErrorMessage } from "@/utils/error";
import { useResendVerification } from "../api/mutations/useResendVerification";

export function useLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [backendError, setBackendError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState<string>(
    location.state?.successMessage || ""
  );

  const resendMutation = useResendVerification();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setBackendError("");
    setSuccessMessage("");
    setShowResend(false);
    setIsSubmitting(true);
    try {
      await login(values);
      navigate("/dashboard", { replace: true });
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, "Terjadi kesalahan saat login");
      setBackendError(errorMessage);
      if (
        errorMessage.toLowerCase().includes("verifikasi") || 
        errorMessage.toLowerCase().includes("verify")
      ) {
        setShowResend(true);
      }
      form.setValue("password", "");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleResend = async () => {
    try {
      const email = form.getValues("email");
      await resendMutation.mutateAsync(email);
      setBackendError("Email verifikasi telah dikirim ulang. Silakan periksa inbox atau folder spam Anda.");
      setShowResend(false);
    } catch (error: unknown) {
      setBackendError(getErrorMessage(error, "Gagal mengirim ulang email verifikasi."));
    }
  };

  const clearMessages = () => {
    if (backendError) {
      setBackendError("");
      setShowResend(false);
    }
    if (successMessage) setSuccessMessage("");
  };

  return {
    form,
    showPassword,
    setShowPassword,
    backendError,
    setBackendError,
    isSubmitting,
    showResend,
    isResending: resendMutation.isPending,
    successMessage,
    setSuccessMessage,
    onSubmit,
    handleResend,
    clearMessages,
  };
}
