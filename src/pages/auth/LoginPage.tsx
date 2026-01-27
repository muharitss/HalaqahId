import { LoginForm } from "@/components/forms/LoginForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faUsersViewfinder } from "@fortawesome/free-solid-svg-icons"; // Tambah icon baru
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LoginCarousel } from "@/components/ui/LoginCarousel";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Button } from "@/components/ui/button"; // Import Button Shadcn

export default function LoginPage() {
  const navigate = useNavigate(); // Inisialisasi navigasi

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

        <div className="mx-auto w-full max-w-md space-y-8 py-10"> {/* Ubah py-30 ke py-10 agar tidak terlalu jauh ke bawah */}
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark">
              Assalamu'alaikum
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Silakan masuk ke akun Anda.
            </p>
          </div>

          <LoginForm />

          {/* --- BAGIAN TAMBAHAN: AKSES PUBLIK --- */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Atau akses publik</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full h-11 gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
              onClick={() => navigate("/display")}
            >
              <FontAwesomeIcon icon={faUsersViewfinder} className="text-primary" />
              Portal Informasi Santri 
            </Button>
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