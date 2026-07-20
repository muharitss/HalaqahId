import React, { useState } from "react";
import { SEO } from "@/components/custom/seo/SEO";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Semua field wajib diisi");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Pesan Anda telah dikirim! Tim support kami akan segera menghubungi Anda.");
      setName("");
      setEmail("");
      setMessage("");
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground bg-background">
      <SEO
        title="Hubungi Kami - Konsultasi & Layanan Support"
        description="Hubungi tim support dan layanan pelanggan Halaqah ID. Tanyakan seputar harga paket, panduan migrasi data sekolah, atau request demo gratis."
        keywords="hubungi halaqah id, nomor support halaqah id, demo tahfidz gratis"
      />

      <Header />

      <main className="flex-1 py-16 sm:py-24 text-left">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact info */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  Hubungi Kami
                </h1>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Apakah Anda ingin menanyakan detail integrasi WhatsApp, ingin request panduan demo bagi guru, atau butuh bantuan teknis migrasi? Tim kami siap menjawab pertanyaan Anda.
                </p>
              </div>

              <div className="space-y-6 pt-4">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">Nomor WhatsApp Support</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">+62 812-3456-7890</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">Surat Elektronik (Email)</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">support@halaqah.id</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">Kantor Pusat</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Jl. Sudirman No. 45, Jakarta Selatan, Indonesia</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-8 sm:p-10 rounded-3xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-350">Nama Lengkap Anda</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama lengkap Anda"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-350">Alamat Email Aktif</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@lembagaanda.com"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-350">Isi Pesan / Pertanyaan</label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tuliskan pertanyaan detail Anda di sini..."
                    className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-4 bg-primary hover:bg-primary/95 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                >
                  {sending ? (
                    <span>Mengirim pesan...</span>
                  ) : (
                    <>
                      <span>Kirim Pesan Sekarang</span>
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
