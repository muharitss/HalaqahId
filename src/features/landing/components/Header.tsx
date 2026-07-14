import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Menu, X } from "lucide-react";
import { useAuth } from "@/features/auth/components/auth-provider";

export const Header: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: "Fitur", href: "/features" },
    { name: "Tentang Kami", href: "/about" },
    { name: "Tanya Jawab", href: "/faq" },
    { name: "Blog", href: "/blog" },
    { name: "Hubungi Kami", href: "/contact" },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <header className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-50 border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20">
              <BookOpen size={18} />
            </div>
            <span className="font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-sky-500">
              Halaqah ID
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-bold tracking-wide transition-colors ${
                  isActive(item.href)
                    ? "text-primary"
                    : "text-slate-650 hover:text-primary dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-sm rounded-xl shadow-md shadow-primary/10 transition-all"
              >
                Ke Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-primary dark:text-slate-350 dark:hover:text-white transition-colors"
                >
                  Log Masuk
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl shadow-md shadow-primary/10 transition-all"
                >
                  Mulai Gratis
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-500 hover:text-slate-700 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b px-4 pt-2 pb-6 space-y-3">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-left font-bold text-sm ${
                isActive(item.href) ? "text-primary" : "text-slate-600 dark:text-slate-350"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-col gap-3">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 bg-primary text-white font-bold text-sm rounded-xl"
              >
                Ke Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 border text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl"
                >
                  Log Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 bg-primary text-white font-bold text-sm rounded-xl"
                >
                  Daftar Akun
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
