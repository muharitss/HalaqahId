import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useVerifyEmail, useResendVerification } from "../api";
import { getErrorMessage } from "@/utils/error";

// Safe client-side decoder for expired/invalid JWT tokens (extracts email payload)
const decodeEmailFromToken = (token: string | null): string => {
  if (!token) return "";
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return "";
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    return payload.email || "";
  } catch (error) {
    console.error("Gagal mendecode email dari token:", error);
    return "";
  }
};

export function useVerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    !token ? "error" : "loading"
  );
  const [message, setMessage] = useState<string>(
    !token ? "Token verifikasi tidak ditemukan di URL." : "Sedang memverifikasi email Anda..."
  );

  const [email, setEmail] = useState<string>(() => {
    return token ? decodeEmailFromToken(token) : "";
  });
  const [resendSuccess, setResendSuccess] = useState<boolean>(false);
  const [resendError, setResendError] = useState<string>("");

  const verifyEmailMutation = useVerifyEmail();
  const resendMutation = useResendVerification();
  const isResending = resendMutation.isPending;

  useEffect(() => {
    if (!token) return;
    const verify = async () => {
      try {
        await verifyEmailMutation.mutateAsync(token);
        setStatus("success");
        setMessage("Email Anda berhasil diverifikasi. Silakan masuk untuk melanjutkan.");
        navigate("/login", {
          replace: true,
          state: {
            successMessage: "Akun Anda berhasil diverifikasi. Silakan masuk untuk melanjutkan."
          }
        });
      } catch (error: unknown) {
        setStatus("error");
        setMessage(
          getErrorMessage(error, "Gagal memverifikasi email. Link mungkin sudah kadaluarsa atau tidak valid.")
        );
      }
    };

    verify();
  }, [token, navigate]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setResendError("Alamat email wajib diisi.");
      return;
    }
    setResendError("");
    setResendSuccess(false);
    try {
      await resendMutation.mutateAsync(email);
      setResendSuccess(true);
      toast.success("Email verifikasi baru berhasil dikirim!");
    } catch (error: unknown) {
      const errMessage = getErrorMessage(error, "Gagal mengirim ulang email verifikasi.");
      setResendError(errMessage);
      toast.error(errMessage);
    }
  };

  return {
    status,
    message,
    email,
    setEmail,
    resendSuccess,
    resendError,
    isResending,
    handleResend,
    navigate,
  };
}
