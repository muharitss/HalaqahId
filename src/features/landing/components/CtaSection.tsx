import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const CtaSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-background border-b border-border text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Card className="border border-primary/20 dark:border-primary/45 bg-primary/[0.01] dark:bg-primary/[0.03] p-8 md:p-12 rounded-2xl relative overflow-hidden shadow-xs">
          {/* Subtle decoration */}
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
          
          <CardContent className="flex flex-col items-center text-center space-y-6 relative z-10 p-0">
            <h2 className="text-3xl font-black font-display tracking-tight text-foreground max-w-2xl leading-tight">
              Mulai Transformasi Digital Program Tahfidz Lembaga Anda Sekarang
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl">
              Tinggalkan pencatatan manual yang melelahkan dan rawan hilang. Wujudkan pengelolaan administrasi tahfidz yang terstruktur, aman, dan profesional bersama HalaqahId.
            </p>
            
            <div className="flex flex-col items-center gap-3">
              <Button asChild size="lg" className="font-bold shadow-md">
                <Link to="/register">
                  Mulai Uji Coba Gratis 14 Hari
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <span className="text-xs text-muted-foreground">
                Hubungi tim kami untuk panduan migrasi data santri dari sistem lama Anda secara cuma-cuma.
              </span>
            </div>
          </CardContent>
        </Card>
        
      </div>
    </section>
  );
};
