import React from "react";
import { Building2, ClipboardCheck, Printer } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: 1,
      icon: <Building2 className="w-5 h-5" />,
      title: "Daftarkan Akun & Atur Halaqah",
      desc: "Daftarkan sekolah Anda, tambahkan daftar asatidz (muhafiz), buat kelompok kelas halaqah, dan impor data santri via Excel.",
    },
    {
      num: 2,
      icon: <ClipboardCheck className="w-5 h-5" />,
      title: "Catat Kehadiran & Setoran Hafalan",
      desc: "Asatidz masuk menggunakan smartphone mereka, mengisi absensi kehadiran, dan mencatat hafalan santri di kelas menggunakan mushaf virtual.",
    },
    {
      num: 3,
      icon: <Printer className="w-5 h-5" />,
      title: "Evaluasi Progres & Unduh Rapor",
      desc: "Koordinator memantau grafik perkembangan santri, melacak pencapaian target hafalan bulanan, dan menerbitkan rapor PDF secara kolektif.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-muted/30 text-left border-b border-border" id="cara-kerja">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
            ALUR KERJA
          </h2>
          <h3 className="text-headline-lg font-headline-lg text-foreground font-display font-bold tracking-tight">
            3 Langkah Praktis Mulai Menggunakan HalaqahId
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Digitalisasi manajemen Tahfidz tanpa kerumitan administrasi fisik.
          </p>
        </div>
        
        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Connector Horizontal line for desktop */}
          <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-[1px] bg-border z-0" />
          
          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-start space-y-4">
              
              {/* Step indicator */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm select-none shadow-sm">
                  {step.num}
                </div>
                <div className="w-8 h-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center border border-border/80">
                  {step.icon}
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
              
            </div>
          ))}
          
        </div>
        
      </div>
    </section>
  );
};
