import React from "react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Daftarkan Lembaga Anda",
      desc: "Buat akun baru untuk sekolah, pesantren, atau TPQ Anda dengan mengisi formulir registrasi singkat.",
    },
    {
      num: "02",
      title: "Atur Halaqah & Asatidz",
      desc: "Buat kelompok halaqah, tambahkan akun ustadz/ustadzah pendamping, dan daftarkan nama-nama santri.",
    },
    {
      num: "03",
      title: "Mulai Pencatatan Setoran",
      desc: "Asatidz mencatat kehadiran (absensi) dan setoran hafalan harian langsung melalui dashboard masing-masing.",
    },
    {
      num: "04",
      title: "Laporan Terkirim Otomatis",
      desc: "Sistem mengirimkan rekapitulasi nilai setoran secara real-time via WhatsApp langsung ke nomor wali santri.",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
            CARA KERJA
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Implementasi Mudah dalam 4 Langkah Praktis
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Tidak memerlukan instalasi server rumit. Halaqah ID berjalan sepenuhnya di cloud dan siap digunakan hanya dalam hitungan menit.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 p-8 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl relative shadow-sm hover:shadow-md transition-all duration-300 text-left space-y-4"
            >
              <div className="text-4xl font-black text-primary/20 dark:text-primary/10 select-none">
                {step.num}
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {step.title}
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
