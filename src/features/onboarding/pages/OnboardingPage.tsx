import { useNavigate, Link } from "react-router-dom";
import {
  Sparkles,
  CheckCircle2,
  LogIn,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { ThemeToggle } from "@/components/custom/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useOnboardingWizard } from "../hooks/useOnboardingWizard";
import { OnboardingWizard } from "../components/OnboardingWizard";

export function OnboardingPage() {
  const navigate = useNavigate();
  const wizard = useOnboardingWizard();
  const { successResult } = wizard;

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-background via-muted/20 to-background flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between pb-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">
            Halaqah<span className="text-primary">.id</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/login")}
            className="text-xs gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sudah punya akun?</span> Masuk
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center py-6">
        {successResult ? (
          /* SUCCESS SCREEN */
          <Card className="w-full max-w-lg mx-auto border-emerald-500/30 bg-card shadow-xl animate-in zoom-in-95 duration-300">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-3">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <CardTitle className="text-2xl text-foreground font-extrabold">
                Pendaftaran Berhasil!
              </CardTitle>
              <CardDescription className="text-sm">
                Lembaga Anda telah siap digunakan di platform Halaqah.id
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              <div className="rounded-xl border bg-muted/40 p-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b">
                  <span className="text-muted-foreground">Nama Lembaga</span>
                  <span className="font-semibold text-foreground">
                    {successResult.tenant.nama_tenant}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b">
                  <span className="text-muted-foreground">Subdomain Akses</span>
                  <span className="font-mono text-primary font-bold">
                    https://{successResult.tenant.slug}.halaqah.id
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b">
                  <span className="text-muted-foreground">Admin Utama</span>
                  <span className="font-semibold text-foreground">
                    {successResult.user.email}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Unit Sekolah</span>
                  <span className="font-semibold text-foreground">
                    {successResult.sekolah.nama_sekolah}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Silakan masuk menggunakan email dan kata sandi yang telah Anda daftarkan untuk mulai mengatur kurikulum dan halaqah santri.
              </p>
            </CardContent>

            <CardFooter className="pt-2 flex flex-col gap-2">
              <Button
                className="w-full gap-2 shadow-md bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => navigate("/login")}
              >
                <span>Masuk ke Halaman Login</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ) : (
          /* ONBOARDING WIZARD */
          <div className="w-full space-y-6">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Registrasi Mandiri Lembaga Baru
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Mulai Kelola Halaqah Tahfidz Anda
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Daftarkan lembaga Anda dalam beberapa langkah mudah untuk mendapatkan akses penuh ke manajemen tahfidz modern.
              </p>
            </div>

            <OnboardingWizard wizard={wizard} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto pt-6 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Halaqah.id — Platform Ekosistem Pendidikan Tahfidz Multi-Tenant.</p>
      </footer>
    </div>
  );
}
