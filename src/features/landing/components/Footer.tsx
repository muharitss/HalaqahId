import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Mail, Phone, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-background text-left font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
          
          {/* Brand & Description */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="text-primary w-5 h-5 shrink-0" />
              <span className="font-bold text-base text-foreground tracking-tight font-display">
                HalaqahId
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              HalaqahId adalah platform manajemen tahfidz Quran berbasis web yang mendigitalisasi pencatatan, mempermudah pelaporan kepada wali santri, serta memanfaatkan teknologi AI untuk mendampingi guru dalam menyimak setoran santri.
            </p>
            <div className="space-y-2 text-xs sm:text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>muharitss@outlook.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>083132212944</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span className="leading-snug">dsn kalangan, RT./RW/RW.01/00, Gegunung, Tirtohargo, Kec. Kretek, Yogyakarta, Daerah Istimewa Yogyakarta 55772</span>
              </div>
            </div>
          </div>
          
          {/* Columns */}
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Produk</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/features" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Fitur Lengkap
                  </Link>
                </li>
                <li>
                  <Link to="/features" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Input dari Mushaf
                  </Link>
                </li>
                <li>
                  <Link to="/features" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Asisten Tahfidz AI
                  </Link>
                </li>
                <li>
                  <Link to="/features" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Evaluasi & Ujian
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Lembaga</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/aplikasi-pondok-pesantren" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Pondok Pesantren
                  </Link>
                </li>
                <li>
                  <Link to="/aplikasi-rumah-tahfidz" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Rumah Tahfidz
                  </Link>
                </li>
                <li>
                  <Link to="/aplikasi-tpq" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    TPQ & Madrasah
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Sekolah Islam
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Perusahaan</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Hubungi Kami
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Blog Informasi
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Pusat Bantuan (FAQ)
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
        </div>
        
        {/* Copyright */}
        <div className="border-t border-border/60 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2026 HalaqahId. Dibuat dengan penuh khidmat untuk mendukung kemajuan pendidikan Al-Quran di Indonesia.</p>
          <p className="font-medium text-foreground">v1.2.0</p>
        </div>
      </div>
    </footer>
  );
};
