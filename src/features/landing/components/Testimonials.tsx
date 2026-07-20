import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialItem {
  id?: string;
  name: string;
  role: string;
  quote: string;
}

interface TestimonialsProps {
  section?: {
    title?: string;
    subtitle?: string;
    content?: any;
  };
}

export const Testimonials: React.FC<TestimonialsProps> = ({ section }) => {
  const [reviews, setReviews] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    if (section && section.content) {
      if (Array.isArray(section.content)) {
        setReviews(section.content);
        return;
      }
    }
    setReviews([]);
  }, [section]);

  if (reviews.length === 0) return null;

  const titleText = section?.title || "TESTIMONI PENGGUNA";
  const subtitleText = section?.subtitle || "Apa Kata Mereka yang Telah Menggunakan HalaqahId?";

  return (
    <section className="py-16 sm:py-24 bg-background text-left border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
            {titleText}
          </h2>
          <h3 className="text-headline-lg font-headline-lg text-foreground font-display font-bold tracking-tight">
            {subtitleText}
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Dipercaya oleh ratusan pengajar, pimpinan pesantren, dan wali santri di seluruh Indonesia.
          </p>
        </div>
        
        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <Card
              key={rev.id || idx}
              className="border border-border bg-card shadow-sm flex flex-col justify-between"
            >
              <CardContent className="pt-6 space-y-4">
                <div className="flex gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500 shrink-0" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  "{rev.quote}"
                </p>
              </CardContent>
              <div className="px-6 pb-6 pt-2 border-t border-border/40 mt-4 bg-muted/[0.01]">
                <p className="font-bold text-sm text-foreground">{rev.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{rev.role}</p>
              </div>
            </Card>
          ))}
        </div>
        
      </div>
    </section>
  );
};
