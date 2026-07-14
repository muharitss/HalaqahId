import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CheckCircle, Shield } from "lucide-react";

interface HeroProps {
  title?: string;
  subtitle?: string;
  keyword?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title = "Sistem Manajemen Halaqah & Tahfidz Quran Modern",
  subtitle = "Solusi digital terbaik untuk mengelola kelompok halaqah, monitoring setoran hafalan santri secara real-time, absensi, dan administrasi laporan perkembangan dalam satu platform terpadu.",
  keyword = "Aplikasi Halaqah",
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-20 lg:py-32">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground text-xs font-semibold tracking-wide uppercase">
              <BookOpen size={14} />
              <span>{keyword} Terpercaya</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              {title}
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl">
              {subtitle}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-0.5 transition-all duration-255"
              >
                <span>Mulai Gratis Sekarang</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/features"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-255"
              >
                <span>Pelajari Fitur</span>
              </Link>
            </div>

            {/* Quick trust badges */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400 pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-500" />
                <span>Tanpa Kartu Kredit</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-emerald-500" />
                <span>Aman & Terenkripsi</span>
              </div>
            </div>
          </div>

          {/* Graphical Mockup Element */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-400 to-primary rounded-3xl blur-2xl opacity-20 -z-10 transform scale-105" />
              
              {/* Glassmorphic card frame */}
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-500 hover:scale-[1.01]">
                
                {/* Simulated App Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-400 rounded-full" />
                    <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <span className="w-3 h-3 bg-green-400 rounded-full" />
                  </div>
                  <span className="text-xs text-slate-400 font-mono">halaqahid-dashboard</span>
                </div>

                <div className="space-y-4">
                  {/* Stat Cards */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase">Total Santri</p>
                      <h4 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">1,248</h4>
                    </div>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 text-xs font-bold rounded-lg">+14% Bln Ini</span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase">Setoran Hafalan</p>
                      <h4 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">3,492 Halaman</h4>
                    </div>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg">Realtime</span>
                  </div>

                  {/* Simulated list item */}
                  <div className="border border-slate-100 dark:border-slate-800 p-4 rounded-2xl space-y-3">
                    <p className="text-xs text-slate-400 font-bold uppercase">Aktivitas Halaqah Terbaru</p>
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                        AN
                      </div>
                      <div className="text-xs space-y-1">
                        <p className="font-bold text-slate-700 dark:text-slate-300">Ahmad Naufal</p>
                        <p className="text-slate-400">Baru saja menyetor Juz 30 (An-Naba 1-20) - Mumtaz</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
