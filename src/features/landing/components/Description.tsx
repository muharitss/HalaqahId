import React from "react";
import { Clipboard, Users, ShieldCheck } from "lucide-react";

export const Description: React.FC = () => {
  const points = [
    {
      icon: <Users size={20} className="text-primary" />,
      title: "Kolaborasi Guru, Santri, & Orang Tua",
      desc: "Menghubungkan asatidz, santri, dan wali santri dalam satu platform untuk transparansi monitoring hafalan.",
    },
    {
      icon: <Clipboard size={20} className="text-primary" />,
      title: "Pencatatan Setoran Otomatis & Cepat",
      desc: "Catat surat, ayat, juz, nilai (sabaq, sabqi, manzil), dan catatan tajwid santri kurang dari 10 detik.",
    },
    {
      icon: <ShieldCheck size={20} className="text-primary" />,
      title: "Data Aman & Terstruktur",
      desc: "Simpan riwayat hafalan santri dengan aman di cloud database. Data aman dari kehilangan fisik.",
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual representation */}
          <div className="lg:col-span-6 relative">
            <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-2xl -z-10 transform scale-95" />
            <div className="bg-slate-50 dark:bg-slate-950 p-6 sm:p-10 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl space-y-6 shadow-xl">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white border-b pb-4">
                Mengapa Lembaga Membutuhkan Halaqah ID?
              </h3>
              
              <ul className="space-y-4 text-left">
                {[
                  "Pencatatan manual di buku kertas sering hilang, sobek, dan sulit direkap.",
                  "Orang tua tidak tahu progres harian anak kecuali saat bagi rapor semester.",
                  "Muhafidz kesulitan memantau target kurikulum santri secara konsisten.",
                  "Kepala lembaga tidak punya dashboard rekapitulasi data riil untuk evaluasi.",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ×
                    </span>
                    <span className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Description Text & Key Points */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
                APA ITU HALAQAH ID?
              </h2>
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                Pusat Kontrol Digital untuk Kemajuan Tahfidz Lembaga Anda
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                Halaqah ID adalah platform SaaS (Software as a Service) yang dirancang khusus untuk memfasilitasi asatidz, pengasuh, pondok pesantren, rumah tahfidz, dan TPQ dalam mengelola kelas halaqah dan memonitor setoran hafalan Al-Quran secara digital, terstruktur, dan efisien.
              </p>
            </div>

            <div className="space-y-6">
              {points.map((point, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    {point.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      {point.title}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                      {point.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
