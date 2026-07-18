import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/custom/theme/ThemeToggle";
import { useVerifyEmailPage } from "../hooks/useVerifyEmailPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function VerifyEmailPage() {
  const {
    status,
    message,
    email,
    setEmail,
    resendSuccess,
    resendError,
    isResending,
    handleResend,
    navigate,
  } = useVerifyEmailPage();

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
