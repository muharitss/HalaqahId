import React from "react";
import { AlertTriangle, Check, ShieldCheck, FileX, MessageSquareOff, Clock3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const Description: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-muted/30 text-left border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
            APA ITU HALAQAH ID?
          </h2>
          <h3 className="text-headline-lg font-headline-lg text-foreground font-display font-bold tracking-tight">
            Pusat Kontrol Digital untuk Kemajuan Tahfidz Lembaga Anda
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            HalaqahId menjembatani kebutuhan yayasan, ustadz pengajar, santri, dan orang tua dalam satu ruang digital yang tenang dan terfokus. Kami menghilangkan tumpukan kertas administrasi agar Anda bisa fokus pada kualitas hafalan.
          </p>
        </div>
        
        {/* Problems vs Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Problem Column Card */}
          <Card className="border border-destructive/20 dark:border-destructive/40 bg-card shadow-sm">
            <CardHeader className="border-b border-border/60 bg-destructive/[0.02] dark:bg-destructive/[0.05] py-4 px-6 flex flex-row items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-destructive">Masalah Administrasi Fisik</CardTitle>
                <CardDescription className="text-[11px]">Sistem fisik yang rentan dan menyita waktu</CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6 pb-6 px-6 space-y-6">
              <div className="flex items-start gap-4">
                <FileX className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-foreground mb-1">Buku Setoran Rentan Hilang</h4>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    Buku setoran hilang/sobek membuat seluruh riwayat dan rekam jejak hafalan santri hilang selamanya tanpa cadangan.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <MessageSquareOff className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-foreground mb-1">Keterbatasan Informasi Wali Murid</h4>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    Wali murid tidak mengetahui perkembangan harian hafalan anak mereka hingga pembagian rapor akhir semester tiba.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock3 className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-foreground mb-1">Waktu Merekap Terbuang</h4>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    Koordinator tahfidz kehabisan waktu berharga hanya untuk merekap manual file Excel bulanan untuk laporan yayasan.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Solution Column Card */}
          <Card className="border border-primary/20 dark:border-primary/40 bg-card shadow-sm">
            <CardHeader className="border-b border-border/60 bg-primary/[0.02] dark:bg-primary/[0.05] py-4 px-6 flex flex-row items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-primary">Solusi HalaqahId</CardTitle>
                <CardDescription className="text-[11px]">Sistem cloud otomatis yang aman dan praktis</CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6 pb-6 px-6 space-y-6">
              <div className="flex items-start gap-4">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-foreground mb-1">Penyimpanan Cloud Aman</h4>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    Seluruh riwayat perkembangan data hafalan santri disimpan terenkripsi secara aman di cloud dan dicadangkan secara harian otomatis.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-foreground mb-1">Monitoring Progres Real-time</h4>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    Wali murid dan pengajar dapat memantau perkembangan grafik pencapaian target hafalan santri kapan saja melalui halaman progres.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-foreground mb-1">Rapor Instan Sekali Klik</h4>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    Konversi otomatis data setoran harian menjadi statistik visual ringkas dan berkas rapor digital PDF yang siap cetak sekali klik.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>
    </section>
  );
};
