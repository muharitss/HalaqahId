import { Link } from "react-router-dom";
import { SEO } from "@/components/custom/seo/SEO";
import { BookOpen, Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-white dark:from-slate-950 dark:to-slate-900 px-6 py-12 text-center">
      <SEO
        title="Halaman Tidak Ditemukan - 404 Error"
        description="Maaf, halaman yang Anda cari tidak dapat ditemukan. Kembali ke halaman utama Halaqah ID."
        robots="noindex, nofollow"
      />

      <div className="space-y-6 max-w-md">
        {/* Animated logo */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/20 animate-bounce">
            <BookOpen size={32} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-8xl font-black tracking-tight text-primary">404</h1>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Halaman Tidak Ditemukan</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Maaf, kami tidak dapat menemukan halaman yang Anda cari. Mungkin URL telah diubah, dihapus, atau terjadi kesalahan ketik.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-sm rounded-xl shadow-md transition-all"
          >
            <Home size={16} />
            <span>Kembali ke Home</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm rounded-xl hover:bg-slate-50 transition-all"
          >
            <ArrowLeft size={16} />
            <span>Halaman Sebelumnya</span>
          </button>
        </div>
      </div>
    </div>
  );
}
