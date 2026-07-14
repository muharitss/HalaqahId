import React from "react";
import { Check, HeartHandshake } from "lucide-react";

export const Advantages: React.FC = () => {
  const points = [
    {
      title: "Desain Multi-Tenant Skalabel",
      desc: "Dirancang untuk mendukung banyak lembaga secara independen. Cocok untuk yayasan yang menaungi beberapa unit sekolah.",
    },
    {
      title: "UI/UX Sangat Responsif & Ringan",
      desc: "Kecepatan akses dioptimalkan bahkan di perangkat seluler dengan kuota internet terbatas. Sangat bersahabat bagi pengajar di lapangan.",
    },
    {
      title: "Support PWA & Akses Offline",
      desc: "Dapat ditambahkan ke beranda ponsel pintar layaknya aplikasi asli (Android/iOS) dan tetap dapat melihat profil data saat koneksi offline.",
    },
    {
      title: "Integrasi Fonnte WhatsApp Gateway",
      desc: "Bekerja sama dengan penyedia gerbang notifikasi lokal terbaik untuk menjamin efisiensi biaya dan kecepatan kirim laporan setoran.",
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Info */}
          <div className="lg:col-span-5 text-left space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
              KEUNGGULAN KAMI
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              Mengapa Halaqah ID Dipilih oleh Puluhan Lembaga Pendidikan?
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Kami tidak hanya membuat pencatatan digital, melainkan membangun ekosistem digitalisasi tahfidz yang aman, andal, mudah dipelajari, dan hemat biaya bagi institusi.
            </p>

            <div className="p-6 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center shrink-0">
                <HeartHandshake size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Dukungan Teknis 24/7</h4>
                <p className="text-xs text-slate-400">Tim technical support kami siap membantu migrasi data lembaga Anda secara cuma-cuma.</p>
              </div>
            </div>
          </div>

          {/* Advantages List */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {points.map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/30 dark:border-slate-800/30 text-left space-y-3"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Check size={18} />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white text-base">
                  {item.title}
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
