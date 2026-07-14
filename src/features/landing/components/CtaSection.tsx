import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const CtaSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-primary py-24 text-white">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative space-y-8">
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Siap Mendigitalisasi Program Tahfidz Lembaga Anda?
        </h2>
        
        <p className="text-lg sm:text-xl text-sky-100 max-w-2xl mx-auto leading-relaxed font-medium">
          Dapatkan kemudahan pencatatan setoran hafalan Al-Quran santri, rekap absensi, dan pengiriman otomatis notifikasi laporan harian ke WhatsApp wali santri.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-250"
          >
            <span>Daftar Sekarang - Gratis</span>
            <ArrowRight size={18} />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-foreground/10 hover:bg-primary-foreground/20 border border-white/20 text-white font-bold rounded-xl transition-all duration-250"
          >
            <span>Hubungi Sales / Tim Support</span>
          </Link>
        </div>

        <p className="text-xs text-sky-200">
          Uji coba gratis selama 14 hari penuh. Tanpa kewajiban memperpanjang.
        </p>
      </div>
    </section>
  );
};
