import { SEO } from "@/components/custom/seo/SEO";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { MessageSquare, Shield, Users, Layers, Trophy } from "lucide-react";

export default function FeaturesPage() {
  const details = [
    {
      icon: <Users className="text-primary" size={28} />,
      title: "Dashboard Multi-Role Komplet",
      desc: "Dashboard terpisah untuk Super Admin yayasan, Admin Unit Sekolah, Koordinator Tahfidz, dan Asatidz. Masing-masing dirancang khusus dengan fitur dan hak akses relevan untuk menyederhanakan alur kerja.",
    },
    {
      icon: <MessageSquare className="text-emerald-500" size={28} />,
      title: "Pesan Laporan Instan WhatsApp",
      desc: "Menyapa orang tua murid langsung di ponsel mereka. Laporan setoran mencakup nama surat, ayat, kategori kelancaran sabaq, absensi, hingga total halaman hafalan terakumulasi secara detail.",
    },
    {
      icon: <Layers className="text-indigo-500" size={28} />,
      title: "Manajemen Kurikulum & Target",
      desc: "Tetapkan target hafalan juz bulanan atau semesteran per jenjang kelas. Guru dapat melihat santri mana yang memerlukan bimbingan ekstra untuk mengejar ketertinggalan target kurikulum.",
    },
    {
      icon: <Trophy className="text-amber-500" size={28} />,
      title: "Ujian Tahfidz Kustom",
      desc: "Konfigurasikan lembar penilaian ujian mandiri. Catat kelancaran (fashahah), ketepatan tajwid, dan adab santri dengan formula perhitungan nilai otomatis untuk menerbitkan rapor cetak PDF.",
    },
    {
      icon: <Shield className="text-rose-500" size={28} />,
      title: "Tempat Sampah & Keamanan Audit",
      desc: "Data penting terhapus secara tidak sengaja? Tenang, fitur Trash (Tempat Sampah) menampung data yang terhapus selama 30 hari sebelum dihapus permanen. Audit Log melacak riwayat aksi admin secara detail.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen text-foreground bg-background">
      <SEO
        title="Fitur Terlengkap Aplikasi Tahfidz & Halaqah"
        description="Jelajahi fitur lengkap Halaqah ID dari pencatatan setoran cepat, pelaporan otomatis WhatsApp, ujian tahfidz kustom, audit log, hingga manajemen multi-tenant."
        keywords="fitur halaqah id, aplikasi tahfidz whatsapp, rapor tahfidz pdf"
      />

      <Header />

      <main className="flex-1 py-16 sm:py-24 text-left">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
              Infrastruktur Terbaik untuk Pengelolaan Kelas Tahfidz
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              Dirancang dengan prinsip skalabilitas tinggi dan kemudahan operasional demi menunjang perkembangan program hafalan Al-Quran.
            </p>
          </div>

          {/* Features Detail Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            {details.map((item, idx) => (
              <div
                key={idx}
                className="p-8 bg-muted/40 dark:bg-muted/10 border border-border rounded-3xl space-y-4 flex flex-col items-start hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-3 bg-card border border-border/40 rounded-2xl">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
