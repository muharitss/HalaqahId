import { LoginForm } from "@/components/forms/LoginForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LoginCarousel } from "@/components/ui/LoginCarousel";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle/>
      </div>
      
      <div className="relative hidden w-1/2 h-full lg:block border-r border-white/10">
        <div className="absolute top-10 left-10 z-20 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/20">
            <FontAwesomeIcon icon={faBookOpen} />
          </div>
          <span className="text-xl font-bold tracking-wide text-white drop-shadow-md">HalaqahId</span>
        </div>

        <LoginCarousel />
      </div>

      <div className="relative flex w-full flex-col items-center justify-center p-6 dark:bg-background-dark lg:w-1/2 overflow-y-auto">
        
        {/* Mobile Header */}
        <div className="absolute left-8 top-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
            <FontAwesomeIcon icon={faBookOpen} />
          </div>
          <span className="text-xl font-bold dark:text-white">HalaqahId</span>
        </div>

        <div className="mx-auto w-full max-w-md space-y-8 py-30 ">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark">
              Assalamu'alaikum
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Silakan masuk ke akun Anda.
            </p>
          </div>

          <LoginForm />

          <div className="text-center">
            <p className="text-sm text-text-secondary-light dark:text-gray-400">
              Belum memiliki akun?{" "}
              <a href="#" className="font-semibold text-primary hover:underline">
                Daftar Sekarang
              </a>
            </p>
          </div>
        </div>

        <div className="mt-auto py-4">
          <p className="text-xs text-text-secondary-light/60 dark:text-gray-600">
            © 2026 Halaqah Management System.
          </p>
        </div>
      </div>
    </div>
  );
}