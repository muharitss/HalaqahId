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

  useEffect(() => {
    if (!token) return;
    const verify = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus("success");
        setMessage("Alhamdulillah! Email Anda berhasil diverifikasi. Silakan masuk untuk melanjutkan.");
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message || 
          "Gagal memverifikasi email. Link mungkin sudah kadaluarsa atau tidak valid."
        );
      }
    };

    verify();
  }, [token]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark p-6">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-white/5 p-8 shadow-xl text-center space-y-6">
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

        {status !== "loading" && (
          <button
            onClick={() => navigate("/login")}
            className="w-full rounded-md bg-primary-light dark:bg-primary-dark px-4 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all duration-200"
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
