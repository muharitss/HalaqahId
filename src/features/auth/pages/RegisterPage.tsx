import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { ThemeToggle } from "@/components/custom/theme/ThemeToggle";
import { LoginCarousel } from "@/features/auth/components/LoginCarousel";
import { LoginHeader } from "@/features/auth/components/LoginHeader";
import { LoginFooter } from "@/features/auth/components/LoginFooter";

export default function RegisterPage() {
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
