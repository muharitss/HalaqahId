import React from "react";
import { Check, HeartHandshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const Advantages: React.FC = () => {
  const points = [
    {
      title: "Desain Multi-Tenant Skala Besar",
      desc: "Memudahkan yayasan besar mengelola banyak unit sekolah atau cabang rumah tahfidz secara independen dalam satu dasbor superadmin pusat.",
    },
    {
      title: "Performa Ringan & Cepat",
      desc: "Dioptimalkan secara khusus agar dapat diakses lancar di smartphone berspesifikasi rendah dengan kuota internet yang terbatas.",
    },
    {
      title: "Antarmuka Tenang Tanpa Distraksi",
      desc: "Skema warna tenang (serene) yang bersih dari gangguan visual atau pop-up, sehingga asatidz dapat khusyuk menyimak hafalan santri.",
    },
    {
      title: "Responsif di Semua Perangkat",
      desc: "Aplikasi web dapat diakses dengan sangat nyaman dan lancar melalui browser di HP, tablet, maupun laptop tanpa perlu mengunduh aplikasi tambahan.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Info */}
          <div className="lg:col-span-5 text-left space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
              KEUNGGULAN KAMI
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              Mengapa HalaqahId Menjadi Pilihan Utama Puluhan Lembaga?
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Kami tidak hanya membuat pencatatan digital, melainkan membangun ekosistem digitalisasi tahfidz yang aman, andal, mudah dipelajari, dan hemat biaya bagi institusi.
            </p>

            <Card className="border border-border/80 bg-muted/30">
              <CardContent className="p-6 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center shrink-0">
                  <HeartHandshake size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-foreground text-sm">Dukungan Teknis Gratis</h4>
                  <p className="text-xs text-muted-foreground">Tim technical support kami siap membantu migrasi data lembaga Anda secara cuma-cuma.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advantages List */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {points.map((item, idx) => (
              <Card
                key={idx}
                className="border border-border/80 bg-muted/20 dark:bg-muted/10 text-left hover:shadow-xs transition-shadow duration-300"
              >
                <CardContent className="p-6 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Check size={18} />
                  </div>
                  <h4 className="font-bold text-foreground text-base">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
