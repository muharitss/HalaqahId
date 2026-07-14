import React from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-450 dark:bg-slate-950 dark:text-slate-400 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Logo & Description */}
          <div className="space-y-4 text-left md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                <BookOpen size={16} />
              </div>
              <span className="font-bold text-lg tracking-tight">Halaqah ID</span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Solusi manajemen tahfidz Al-Quran dan monitoring halaquh santri berbasis cloud modern dan terintegrasi WhatsApp.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3 text-left">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">Layanan</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link to="/features" className="hover:text-white transition-colors">Fitur Utama</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Tanya Jawab</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Artikel & Tips</Link></li>
            </ul>
          </div>

          <div className="space-y-3 text-left">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">Landing SEO</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/aplikasi-halaqah" className="hover:text-white transition-colors">Aplikasi Halaqah</Link></li>
              <li><Link to="/aplikasi-tahfidz" className="hover:text-white transition-colors">Aplikasi Tahfidz</Link></li>
              <li><Link to="/aplikasi-rumah-tahfidz" className="hover:text-white transition-colors">Aplikasi Rumah Tahfidz</Link></li>
            </ul>
          </div>

          <div className="space-y-3 text-left">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">Perusahaan</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">Tentang Kami</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Hubungi Kami</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Portal Log Masuk</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {currentYear} Halaqah ID. Hak cipta dilindungi undang-undang.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
