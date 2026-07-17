import { LoginForm } from "../components/login-form";
import { ThemeToggle } from "@/components/custom/theme/ThemeToggle";
import { LoginCarousel } from "../components/login-carousel";
import { LoginHeader } from "../components/login-header";
import { LoginFooter } from "../components/login-footer";

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
