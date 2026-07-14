import React from "react";
import { BookOpen, Calendar, MessageSquare, BarChart3, ShieldCheck, CheckSquare } from "lucide-react";

export interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

export const Features: React.FC = () => {
  const list: FeatureItem[] = [
    {
      icon: <Calendar className="text-primary" size={24} />,
      title: "Kelola Kelas & Halaqah",
      desc: "Atur pembagian kelompok santri dan tentukan muhafiz/muhafidzah pendamping kelas dengan mudah.",
    },
    {
      icon: <BookOpen className="text-sky-500" size={24} />,
      title: "Pencatatan Setoran",
      desc: "Simpan data setoran hafalan baru (Sabqi/Manzil) lengkap dengan juz, surah, ayat, dan klasifikasi kelancaran.",
    },
    {
      icon: <MessageSquare className="text-emerald-500" size={24} />,
      title: "Notifikasi WhatsApp",
      desc: "Kirim laporan setoran hafalan harian dan absensi santri secara otomatis langsung ke WhatsApp wali murid.",
    },
    {
      icon: <BarChart3 className="text-amber-500" size={24} />,
      title: "Analitik Kemajuan",
      desc: "Visualisasikan progres hafalan santri dalam grafik interaktif untuk melihat pertumbuhan pencapaian juz.",
    },
    {
      icon: <CheckSquare className="text-violet-500" size={24} />,
      title: "Ujian & Penilaian Kustom",
      desc: "Buat parameter penilaian ujian tahfidz tersendiri menyesuaikan standar kriteria kelulusan lembaga Anda.",
    },
    {
      icon: <ShieldCheck className="text-rose-500" size={24} />,
      title: "Audit Log & Keamanan Data",
      desc: "Lacak seluruh log aktivitas perubahan data sistem untuk meminimalisir manipulasi dan kehilangan data.",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
            FITUR UTAMA
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Fitur Lengkap untuk Skalabilitas Lembaga Tahfidz
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
            Halaqah ID menyediakan modul terlengkap dari hulu ke hilir untuk membantu manajemen operasional tahfidz dan program setoran hafalan menjadi lebih sistematis.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 p-8 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-left space-y-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {item.title}
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
