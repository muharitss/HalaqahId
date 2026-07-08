import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { LoginForm } from "./components/login-form";
import { RegisterForm } from "./components/register-form";
import { ThemeToggle } from "@/components/custom/theme/ThemeToggle";
import { LoginCarousel } from "./components/login-carousel";
import { LoginHeader } from "./components/login-header";
import { LoginFooter } from "./components/login-footer";
import { authService } from "./api/authService";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { getErrorMessage } from "@/utils/error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

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

export function LoginPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className="relative hidden w-1/2 h-full lg:block border-r border-white/10">
        <LoginHeader />
        <LoginCarousel />
      </div>

      <div className="relative flex w-full flex-col items-center justify-center p-6 dark:bg-background-dark lg:w-1/2 overflow-y-auto">
      
        <div className="mx-auto w-full max-w-md space-y-8 py-10">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark">
              Assalamu'alaikum
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Silakan masuk ke akun Anda.
            </p>
          </div>

          <LoginForm />
        </div>

        <LoginFooter />
      </div>
    </div>
  );
}

export function RegisterPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div className="relative hidden w-1/2 h-full lg:block border-r border-white/10">
        <LoginHeader />
        <LoginCarousel />
      </div>

      <div className="relative flex w-full flex-col items-center justify-center p-6 dark:bg-background-dark lg:w-1/2 overflow-y-auto">
      
        <div className="mx-auto w-full max-w-md space-y-8 py-10">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark">
              Daftar Baru
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Buat akun admin dan daftarkan institusi Anda.
            </p>
          </div>

          <RegisterForm />
        </div>

        <LoginFooter />
      </div>
    </div>
  );
}

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    !token ? "error" : "loading"
  );
  const [message, setMessage] = useState<string>(
    !token ? "Token verifikasi tidak ditemukan di URL." : "Sedang memverifikasi email Anda..."
  );

  const [email, setEmail] = useState<string>("");
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendSuccess, setResendSuccess] = useState<boolean>(false);
  const [resendError, setResendError] = useState<string>("");

  useEffect(() => {
    if (token) {
      const decodedEmail = decodeEmailFromToken(token);
      if (decodedEmail) {
        setEmail(decodedEmail);
      }
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const verify = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus("success");
        setMessage("Alhamdulillah! Email Anda berhasil diverifikasi. Silakan masuk untuk melanjutkan.");
        navigate("/login", {
          replace: true,
          state: {
            successMessage: "Alhamdulillah! Akun Anda berhasil diverifikasi. Silakan masuk untuk melanjutkan."
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
    setIsResending(true);
    setResendError("");
    setResendSuccess(false);
    try {
      await authService.resendVerification(email);
      setResendSuccess(true);
      toast.success("Email verifikasi baru berhasil dikirim!");
    } catch (error: unknown) {
      const errMessage = getErrorMessage(error, "Gagal mengirim ulang email verifikasi.");
      setResendError(errMessage);
      toast.error(errMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark p-6">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-white/5 p-8 shadow-xl text-center space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="flex justify-center">
          {status === "loading" && <Loader2 className="h-16 w-16 animate-spin text-primary-light dark:text-primary-dark" />}
          {status === "success" && <CheckCircle2 className="h-16 w-16 text-green-500" />}
          {status === "error" && <XCircle className="h-16 w-16 text-red-500" />}
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark">
            {status === "loading" && "Verifikasi Email"}
            {status === "success" && "Verifikasi Berhasil"}
            {status === "error" && "Verifikasi Gagal"}
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
            {message}
          </p>
        </div>

        {status === "error" && (
          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5 text-left animate-in slide-in-from-top-4 duration-300">
            <h3 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
              Minta Verifikasi Ulang
            </h3>
            
            {resendSuccess ? (
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 text-green-800 dark:text-green-300 text-sm space-y-2">
                <p className="font-semibold text-center text-green-900 dark:text-green-200">Email verifikasi berhasil dikirim!</p>
                <p className="text-xs text-center text-green-700 dark:text-green-400">
                  Silakan periksa email <strong>{email}</strong> Anda (termasuk folder spam/promosi) untuk tautan verifikasi baru.
                </p>
              </div>
            ) : (
              <form onSubmit={handleResend} className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="resend-email" className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">
                    Masukkan Email Terdaftar
                  </label>
                  <Input
                    id="resend-email"
                    type="email"
                    placeholder="nama@contoh.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isResending}
                    required
                    className="w-full"
                  />
                </div>
                
                {resendError && (
                  <p className="text-xs text-red-500 font-medium leading-relaxed">{resendError}</p>
                )}

                <Button
                  type="submit"
                  disabled={isResending}
                  className="w-full bg-primary hover:opacity-90 transition-opacity"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    "Kirim Ulang Email Verifikasi"
                  )}
                </Button>
              </form>
            )}
          </div>
        )}

        {status !== "loading" && (
          <button
            onClick={() => navigate("/login")}
            className="w-full rounded-md bg-muted px-4 py-2.5 text-sm font-semibold text-text-primary-light dark:text-text-primary-dark shadow-sm hover:bg-muted/80 transition-all duration-200 border border-gray-200 dark:border-white/5"
          >
            {status === "success" ? "Lanjut ke Login" : "Kembali ke Halaman Login"}
          </button>
        )}
      </div>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export * from './types/auth.schema';
// eslint-disable-next-line react-refresh/only-export-components
export * from './components/auth-provider';
