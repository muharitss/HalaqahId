import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FaqItem {
  q: string;
  a: string;
}

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs: FaqItem[] = [
    {
      q: "Apakah Halaqah ID bisa digunakan secara gratis?",
      a: "Ya! Kami menyediakan paket uji coba gratis (Free Trial) untuk dicoba lembaga Anda dengan kuota santri dan fitur pencatatan standar secara gratis.",
    },
    {
      q: "Apakah data hafalan santri kami aman dari kehilangan?",
      a: "Sangat aman. Seluruh data disimpan di cloud database terpusat yang dicadangkan secara harian otomatis. Tidak perlu khawatir kehilangan data layaknya buku saku fisik.",
    },
    {
      q: "Apakah kami bisa memodifikasi kriteria penilaian dan target ujian?",
      a: "Tentu bisa! Administrator sekolah memiliki akses penuh di dashboard Pengaturan Ujian untuk merancang kriteria penilaian kustom (kesalahan tajwid, kelancaran, fashahah), target kurikulum, serta kategori setoran sesuai kebutuhan lembaga.",
    },
    {
      q: "Bagaimana cara mencatat setoran santri di kelas?",
      a: "Asatidz dapat mencatat setoran dengan sangat mudah dengan cara mengeklik nomor ayat awal dan akhir secara langsung pada visualisasi lembaran mushaf digital yang interaktif di aplikasi.",
    },
    {
      q: "Apakah lembaga kami bisa merilis artikel wawasan atau berita?",
      a: "Ya. Melalui dashboard superadmin, pengelola (superadmin) dapat mempublikasikan wawasan baru, tips menghafal, info kegiatan, maupun berita edukasi lainnya yang akan otomatis tampil pada halaman Blog website.",
    },
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-24 bg-muted/30 border-b border-border text-left" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
            FAQ (TANYA JAWAB)
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight font-display">
            Pertanyaan yang Sering Diajukan
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Menemukan kebingungan mengenai fitur, biaya, atau instalasi? Temukan jawaban cepat Anda di bawah ini.
          </p>
        </div>

        {/* Collapsible FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <Card
                key={idx}
                className="bg-card rounded-2xl border border-border overflow-hidden shadow-xs flex flex-col gap-0 py-0"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-bold text-foreground text-sm sm:text-base">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="text-muted-foreground shrink-0 ml-4 w-5 h-5" />
                  ) : (
                    <ChevronDown className="text-muted-foreground shrink-0 ml-4 w-5 h-5" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 text-left border-t border-border/40 pt-4 bg-muted/[0.01]">
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
};
