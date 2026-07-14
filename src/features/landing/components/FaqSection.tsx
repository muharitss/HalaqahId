import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs: FaqItem[] = [
    {
      q: "Apakah Halaqah ID bisa digunakan secara gratis?",
      a: "Ya! Kami menyediakan paket Free Trial gratis untuk dicoba lembaga Anda dengan kuota santri dan fitur pencatatan standar secara gratis.",
    },
    {
      q: "Bagaimana cara kerja pengiriman WhatsApp ke wali santri?",
      a: "Halaqah ID terintegrasi secara native dengan WhatsApp Gateway. Ustadz hanya perlu menginput nilai setoran hafalan santri di aplikasi, dan sistem akan langsung memicu pengiriman pesan WhatsApp ke nomor wali santri secara real-time.",
    },
    {
      q: "Apakah data hafalan santri kami aman dari kehilangan?",
      a: "Sangat aman. Seluruh data disimpan terenkripsi di server database cloud (PostgreSQL) yang dicadangkan secara harian otomatis. Tidak perlu khawatir kehilangan data layaknya buku saku fisik.",
    },
    {
      q: "Apakah kami bisa memodifikasi indikator kriteria penilaian ujian?",
      a: "Tentu bisa! Administrator sekolah memiliki akses penuh di dashboard Pengaturan Ujian untuk merancang SOP penilai kustom, bobot kesalahan (tajwid, lancar, fashahah), dan klasifikasi nilai kelulusan sendiri.",
    },
    {
      q: "Bagaimana cara menghubungkan domain kustom lembaga kami?",
      a: "Bagi lembaga paket Enterprise, tim kami akan membantu menghubungkan subdomain kustom (misal: tahfidz.pesantrenanda.sch.id) untuk branding mandiri tanpa tambahan biaya setup.",
    },
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
            FAQ (TANYA JAWAB)
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Pertanyaan yang Sering Diajukan
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Menemukan kebingungan mengenai fitur, biaya, atau instalasi? Temukan jawaban cepat Anda di bawah ini.
          </p>
        </div>

        {/* Collapsible FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-bold text-slate-800 dark:text-white text-base">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="text-slate-400 shrink-0 ml-4" size={20} />
                  ) : (
                    <ChevronDown className="text-slate-400 shrink-0 ml-4" size={20} />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 text-left border-t border-slate-100 dark:border-slate-800 pt-4">
                    <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
