import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, PlayCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface HeroProps {
  title?: string;
  subtitle?: string;
  keyword?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title = "Beralih dari Kertas, Digitalkan Pencatatan & Evaluasi Tahfidz Quran",
  subtitle = "Sederhanakan pendataan setoran hafalan santri secara digital, otomatisasi pembuatan rapor PDF, dan pantau perkembangan belajar secara berkala.",
  keyword = "Didukung Whisper Engine v3 AI",
}) => {
  return (
    <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden bg-background text-foreground border-b border-border">
      {/* Subtle Dot Grid Background */}
      <div className="absolute inset-0 bg-pattern-subtle z-0 opacity-40"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column (Text & Actions) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 select-none">
              🤖 {keyword}
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-foreground leading-[1.1]">
              {title}
            </h1>
            
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium max-w-2xl">
              {subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
              <Button asChild size="lg" className="font-bold shadow-md">
                <Link to="/register">
                  Mulai Gratis Sekarang
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="font-bold shadow-xs">
                <Link to="/contact">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Hubungi Layanan Demo
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary shrink-0" />
                Gratis Uji Coba
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary shrink-0" />
                Tidak Butuh Kartu Kredit
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary shrink-0" />
                Setup Cepat 5 Menit
              </div>
            </div>
          </div>
          
          {/* Right Column (Simulated Live Mockup Dashboard) */}
          <div className="lg:col-span-5 relative w-full">
            <Card className="shadow-xl border border-border/80 bg-card overflow-hidden">
              {/* Simulated Window Toolbar */}
              <div className="border-b border-border/80 bg-muted/40 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-destructive/60 rounded-full inline-block" />
                  <span className="w-2.5 h-2.5 bg-yellow-500/60 rounded-full inline-block" />
                  <span className="w-2.5 h-2.5 bg-primary/60 rounded-full inline-block" />
                </div>
                <span className="text-xs text-muted-foreground font-mono select-none">halaqahid-dashboard</span>
              </div>
              
              <CardContent className="pt-6 pb-6 px-6 space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-border/60 bg-muted/20 p-4 rounded-lg flex flex-col justify-between h-20">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Santri</p>
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-black text-foreground">1,248</span>
                      <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">+14%</span>
                    </div>
                  </div>
                  
                  <div className="border border-border/60 bg-muted/20 p-4 rounded-lg flex flex-col justify-between h-20">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Peningkatan</p>
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-black text-primary flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-primary shrink-0" />
                        45%
                      </span>
                      <span className="text-[9px] font-bold text-muted-foreground">Efisiensi</span>
                    </div>
                  </div>
                </div>
                
                {/* Simulated Student List */}
                <div className="border border-border/60 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-border/40">
                    <p className="text-[11px] font-bold text-foreground">Aktivitas Halaqah Terbaru</p>
                    <Badge variant="outline" className="text-[9px] px-1 py-0.5 text-primary border-primary/20">Realtime</Badge>
                  </div>
                  
                  <div className="space-y-3 text-left">
                    {/* Item 1 */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-foreground">Ahmad Naufal</span>
                        <span className="text-muted-foreground text-[10px]">Juz 30: An-Naba 1-20</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={80} className="h-1.5" />
                        <span className="text-[9px] font-bold text-primary">80%</span>
                      </div>
                    </div>
                    
                    {/* Item 2 */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-foreground">Sarah Amira</span>
                        <span className="text-muted-foreground text-[10px]">Juz 29: Al-Mulk 1-15</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={45} className="h-1.5" />
                        <span className="text-[9px] font-bold text-primary">45%</span>
                      </div>
                    </div>
                    
                    {/* Item 3 */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-foreground">Rizky Ramadhan</span>
                        <span className="text-muted-foreground text-[10px]">Juz 1: Al-Baqarah 1-50</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={95} className="h-1.5" />
                        <span className="text-[9px] font-bold text-primary">95%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </section>
  );
};
