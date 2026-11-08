import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "../validation/auth.schema";
import { useForgotPassword } from "../api/mutations/useForgotPassword";
import { getErrorMessage } from "@/utils/error";

export function useForgotPasswordForm() {
  const [backendError, setBackendError] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedEmail, setSubmittedEmail] = useState<string>("");

  const forgotMutation = useForgotPassword();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setBackendError("");
    try {
      await forgotMutation.mutateAsync(values);
      setSubmittedEmail(values.email);
      setIsSubmitted(true);
    } catch (error: unknown) {
      setBackendError(
        getErrorMessage(error, "Gagal mengirimkan instruksi reset password. Silakan coba lagi.")
      );
    }
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setSubmittedEmail("");
    setBackendError("");
    form.reset({ email: "" });
  };

  const clearMessages = () => {
    if (backendError) setBackendError("");
  };

  return {
    form,
    isSubmitting: forgotMutation.isPending,
    isSubmitted,
    submittedEmail,
    backendError,
    onSubmit,
    handleResetForm,
    clearMessages,
  };
}
