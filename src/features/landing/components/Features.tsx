import React from "react";
import { BookOpen, ClipboardList, Play, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Features: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-background text-left border-b border-border" id="fitur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
            FITUR SISTEM
          </h2>
          <h3 className="text-headline-lg font-headline-lg text-foreground font-display font-bold tracking-tight">
            Didesain Khusus untuk Alur Kerja Pembelajaran Quran
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Menyajikan kemudahan pengelolaan administrasi kelas tahfidz terintegrasi dalam satu sistem.
          </p>
        </div>
        
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Asisten Verifikasi AI (Span 2) */}
          <Card className="md:col-span-2 shadow-sm border border-border hover:shadow-md transition-shadow relative overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4 shrink-0 group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg font-bold text-foreground">Asisten Verifikasi AI</CardTitle>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-xl">
                Deteksi bacaan santri menggunakan mikrofon dan temukan letak surat serta ayat mutasyabihat yang mirip untuk meminimalkan kesalahan simakan asatidz.
              </p>
            </CardHeader>
            
            <CardContent className="pb-6">
              {/* React Live Waveform / Voice transcript mockup */}
              <div className="border border-border p-4 rounded-lg bg-muted/20 space-y-3 max-w-md">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-border/40">
                  <span className="font-semibold flex items-center gap-1.5 text-foreground">
                    <Play className="w-3 h-3 text-primary fill-primary" />
                    Rekaman Setoran Murid
                  </span>
                  <Badge variant="outline" className="text-[9px] px-1.5 text-primary border-primary/20 bg-primary/5">Aktif</Badge>
                </div>
                
                {/* Waveform Visualization Bars */}
                <div className="flex items-end gap-1 h-8 justify-center select-none pt-1">
                  {[4, 8, 12, 16, 24, 20, 16, 8, 12, 18, 28, 20, 16, 12, 22, 28, 24, 18, 12, 8, 14, 20, 24, 16, 8, 4].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}px` }}
                      className={`w-1 rounded-full shrink-0 ${h > 18 ? "bg-primary" : "bg-muted-foreground/30"}`}
                    />
                  ))}
                </div>
                
                {/* Live Transcript text */}
                <div className="text-[11px] bg-card p-2.5 border border-border/60 rounded-md font-mono space-y-1">
                  <div className="flex justify-between text-[9px] text-muted-foreground">
                    <span>Hasil Deteksi AI</span>
                    <span className="text-primary font-bold">99.8% Cocok</span>
                  </div>
                  <p className="text-foreground font-medium">"Alif-Laam-Meem. Dzaalikal kitaabu laa rayba fiih..."</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Card 2: Sistem Absensi & Kehadiran (Span 1 width) */}
          <Card className="md:col-span-1 shadow-sm border border-border hover:shadow-md transition-shadow flex flex-col justify-between group overflow-hidden">
            <CardHeader className="pb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4 shrink-0 group-hover:scale-105 transition-transform duration-300">
                <ClipboardList className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg font-bold text-foreground">Sistem Absensi & Kehadiran</CardTitle>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                Pencatatan kehadiran harian santri secara cepat dengan pilihan status Hadir, Sakit, Izin, dan Alfa demi pemantauan kedisiplinan belajar.
              </p>
            </CardHeader>
            
            <CardContent className="pb-6">
              {/* Attendance Table Mockup */}
              <div className="border border-border rounded-lg overflow-hidden bg-card font-sans shadow-sm text-left">
                <div className="bg-muted/40 text-[10px] px-3 py-2 font-bold border-b border-border text-muted-foreground uppercase tracking-wider">
                  Absensi Halaqah Hari Ini
                </div>
                <div className="p-2 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] p-1.5 bg-muted/10 rounded border border-border/40">
                    <span className="font-semibold text-foreground">Ahmad Naufal</span>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Hadir</Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] p-1.5 bg-muted/10 rounded border border-border/40">
                    <span className="font-semibold text-foreground">Sarah Amira</span>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0.5 bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Izin</Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] p-1.5 bg-muted/10 rounded border border-border/40">
                    <span className="font-semibold text-foreground">Rizky Ramadhan</span>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0.5 bg-rose-500/10 text-rose-500 border-rose-500/20">Alfa</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Card 3: Input Setoran Langsung dari Mushaf */}
          <Card className="shadow-sm border border-border hover:shadow-md transition-shadow">
            <CardHeader className="pb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <CardTitle className="text-base font-bold text-foreground">Input Setoran Langsung dari Mushaf</CardTitle>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                Input setoran cepat dengan mengeklik ayat awal dan akhir langsung pada lembar mushaf digital yang interaktif dan mudah dikelola.
              </p>
            </CardHeader>
          </Card>
          
          {/* Card 4: Evaluasi & Ujian Kustom */}
          <Card className="shadow-sm border border-border hover:shadow-md transition-shadow">
            <CardHeader className="pb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                <ClipboardList className="w-5 h-5" />
              </div>
              <CardTitle className="text-base font-bold text-foreground">Evaluasi & Ujian Kustom</CardTitle>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                SOP penilaian ujian tahfidz yang fleksibel sesuai regulasi kelulusan lembaga Anda sendiri demi kredibilitas rekam jejak.
              </p>
            </CardHeader>
          </Card>
          
        </div>
      </div>
    </section>
  );
};
