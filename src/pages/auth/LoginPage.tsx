import { LoginForm } from "@/components/forms/LoginForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import loginBg from "@/assets/login-bg.png"; 

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      
      {/* --- Bagian Kiri: Branding & Image (Hanya muncul di Desktop) --- */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-surface-dark lg:flex">
        {/* Background Image dengan Overlay */}
        <div 
          className="absolute inset-0 h-full w-full bg-cover bg-center opacity-60 transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: `url(${loginBg})` }}
        />
        
        {/* Gradient Overlay untuk keterbacaan teks */}
        <div className="absolute inset-0 bg-gradient-to-b from-background-dark/30 to-background-dark/90" />

        {/* Konten Branding */}
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/20">
                <FontAwesomeIcon icon={faBookOpen} />
              </div>
              <span className="text-xl font-bold tracking-wide text-white font-display">HalaqahId</span>
            </div>
          </div>

          <div className="max-w-lg">
            <h2 className="mb-4 text-4xl font-bold leading-tight text-white font-display">
              "Recite: In the name of thy Lord who created..."
            </h2>
            <p className="text-lg font-light leading-relaxed text-gray-200">
              Kelola santri, pantau hafalan, dan organisir halaqah Anda dengan lebih efisien dan terstruktur.
            </p>
          </div>

          {/* Stepper Indikator (Dekoratif) */}
          <div className="flex gap-2">
            <div className="h-1.5 w-10 rounded-full bg-primary" />
            <div className="h-1.5 w-3 rounded-full bg-white/30" />
            <div className="h-1.5 w-3 rounded-full bg-white/30" />
          </div>
        </div>
      </div>

      {/* --- Bagian Kanan: Form Login --- */}
      <div className="relative flex w-full flex-col items-center justify-center bg-surface-light p-6 dark:bg-background-dark lg:w-1/2">
        
        {/* Mobile Header Logo (Hanya muncul di layar kecil) */}
        <div className="absolute left-8 top-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
            <FontAwesomeIcon icon={faBookOpen} className="text-lg" />
          </div>
          <span className="text-xl font-bold dark:text-white font-display">HalaqahId</span>
        </div>

        <div className="mx-auto w-full max-w-md space-y-8">
          {/* Header Teks */}
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark font-display">
              Assalamu'alaikum, Ahlan Wa Sahlan
            </h2>
            <p className="text-base text-text-secondary-light dark:text-text-secondary-dark">
              Silakan masuk untuk mengakses Dashboard Halaqah Anda.
            </p>
          </div>

          {/* Pemanggilan Komponen LoginForm */}
          <div className="mt-8">
            <LoginForm />
          </div>

          {/* Footer Form */}
          <div className="text-center">
            <p className="text-sm text-text-secondary-light dark:text-gray-400">
              Belum memiliki akun?{" "}
              <a href="#" className="font-semibold text-primary hover:text-primary-dark transition-colors">
                Daftarkan Lembaga
              </a>
            </p>
          </div>
        </div>

        {/* Footer Copyright */}
        <div className="absolute bottom-8 left-0 w-full text-center">
          <p className="text-xs text-text-secondary-light/60 dark:text-gray-600">
            © 2026 Halaqah Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}