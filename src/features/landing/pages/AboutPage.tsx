import { SEO } from "@/components/custom/seo/SEO";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Award, Compass, Eye, ShieldAlert, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-950">
      <SEO
        title="Tentang Kami - Digitalisasi Tahfidz Indonesia"
        description="Pelajari visi, misi, dan latar belakang Halaqah ID dalam membangun infrastruktur teknologi terbaik untuk program tahfidz Al-Quran di Indonesia."
        keywords="tentang halaqah id, visi misi halaqah id, monitoring hafalan, startup islami"
      />

      <Header />

      <main className="flex-1 py-16 sm:py-24 text-left">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Hero text */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Membangun Masa Depan Pendidikan Al-Quran Melalui Teknologi
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
              Halaqah ID lahir dari keprihatinan mendalam mengenai inefisiensi administrasi halaqah tahfidz manual. Kami hadir untuk memberikan solusi digital cerdas yang menyatukan peran pengajar, institusi, dan orang tua demi melahirkan generasi penghafal Al-Quran yang tangguh.
            </p>
          </div>

          {/* Vision/Mission Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl space-y-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Compass size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Visi Kami</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Menjadi platform teknologi pendidikan Islam (EdTech) nomor satu di Asia Tenggara yang mendigitalisasi dan memudahkan operasional 1 juta halaqah Quran pada tahun 2030.
              </p>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl space-y-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                <Eye size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Misi Kami</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Menyediakan aplikasi pencatatan setoran hafalan yang secepat kilat, menghadirkan transparansi monitoring harian bagi orang tua via WhatsApp, dan merancang alat bantu analitik kurikulum yang mendalam untuk evaluator lembaga.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Nilai-Nilai Inti Kami</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: <Award className="text-primary" />, title: "Amanah", desc: "Menjaga integritas dan kerahasiaan data lembaga pendidikan tahfidz dengan standar tertinggi." },
                { icon: <Zap className="text-amber-500" />, title: "Inovasi", desc: "Terus memperbarui fitur aplikasi tahfidz dengan teknologi AI dan analisis mutakhir." },
                { icon: <ShieldAlert className="text-rose-500" />, title: "Peduli", desc: "Fokus mendengarkan masukan para asatidz di lapangan untuk menciptakan interface yang mudah digunakan." },
              ].map((val, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                    {val.icon}
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-800 dark:text-white">{val.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
