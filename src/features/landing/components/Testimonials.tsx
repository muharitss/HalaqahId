import React from "react";
import { Star } from "lucide-react";

interface TestimonialItem {
  name: string;
  role: string;
  institution: string;
  content: string;
  avatar: string;
}

export const Testimonials: React.FC = () => {
  const testimonials: TestimonialItem[] = [
    {
      name: "Ustadz H. Abdul Wahab, Lc.",
      role: "Kepala Kepengasuhan Tahfidz",
      institution: "Pondok Pesantren Al-Iman",
      content: "Semenjak menggunakan Halaqah ID, wali santri tidak perlu lagi menelepon asatidz untuk menanyakan perkembangan juz anak. Laporan setoran harian masuk otomatis ke WhatsApp mereka. Sangat menghemat waktu administrasi kami!",
      avatar: "AW",
    },
    {
      name: "Dr. Laila Rahmawati",
      role: "Ketua Yayasan Pendidikan",
      institution: "Yayasan Rumah Tahfidz Qurrata A'yun",
      content: "Kami menaungi 5 cabang rumah tahfidz. Dulu rekapitulasi data santri kelulusan juz sangat berantakan. Sekarang saya bisa memonitor perkembangan semua cabang secara real-time lewat satu dashboard Superadmin saja.",
      avatar: "LR",
    },
    {
      name: "Ustadzah Nurul Hidayah, S.Ag.",
      role: "Muhafizah Kelas Akhwat",
      institution: "TPQ Baitul Quran Jakarta",
      content: "Aplikasi ini sangat ringan dibuka lewat HP jadul saya sekalipun. Pencatatan sabaq dan sabqi santri menjadi sangat praktis, cukup klik-klik saja tidak sampai 10 detik per santri selesai.",
      avatar: "NH",
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
            TESTIMONI PENGGUNA
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Telah Membantu Puluhan Pengajar & Lembaga Pendidikan
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Dengarkan tanggapan tulus dari asatidz, pengelola pondok pesantren, dan pimpinan rumah tahfidz yang merasakan langsung kemudahan digitalisasi tahfidz bersama kami.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-950 p-8 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl text-left flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="space-y-4">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base italic leading-relaxed">
                  "{item.content}"
                </p>
              </div>

              <div className="flex items-center gap-4 mt-8 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  {item.avatar}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{item.name}</h4>
                  <p className="text-slate-400 text-xs truncate">
                    {item.role}, {item.institution}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
