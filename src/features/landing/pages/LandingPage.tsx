import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { SEO } from "@/components/custom/seo/SEO";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Description } from "../components/Description";
import { Features } from "../components/Features";
import { Advantages } from "../components/Advantages";
import { HowItWorks } from "../components/HowItWorks";
import { Testimonials } from "../components/Testimonials";
import { FaqSection } from "../components/FaqSection";
import { BlogPreview } from "../components/BlogPreview";
import { CtaSection } from "../components/CtaSection";
import { Footer } from "../components/Footer";

// Keyword variations configurations for SEO landing pages
const KEYWORD_CONFIGS: Record<
  string,
  { title: string; subtitle: string; keyword: string; metaDesc: string }
> = {
  "/aplikasi-halaqah": {
    title: "Aplikasi Halaqah Al-Quran Digital Terintegrasi",
    subtitle: "Kelompokkan santri, pantau presensi kehadiran halaqah, dan catat setoran hafalan murid secara real-time.",
    keyword: "Aplikasi Halaqah",
    metaDesc: "Cari aplikasi halaqah terbaik? Halaqah ID menyediakan sistem manajemen kelompok halaqah Quran, presensi guru, dan monitoring setoran santri harian.",
  },
  "/aplikasi-tahfidz": {
    title: "Aplikasi Tahfidz Quran Modern untuk Sekolah & Pesantren",
    subtitle: "Sistem informasi manajemen tahfidzul quran terlengkap untuk mencatat perkembangan hafalan santri secara sistematis.",
    keyword: "Aplikasi Tahfidz",
    metaDesc: "Halaqah ID adalah aplikasi tahfidz quran terbaik untuk mempermudah asatidz mencatat kemajuan hafalan juz Al-Quran santri dan santriwati.",
  },
  "/aplikasi-rumah-tahfidz": {
    title: "Aplikasi Rumah Tahfidz & TPQ Berbasis Web & Mobile",
    subtitle: "Kelola puluhan santri rumah tahfidz Anda dengan mudah. Lengkap dengan notifikasi setoran harian otomatis via WhatsApp.",
    keyword: "Aplikasi Rumah Tahfidz",
    metaDesc: "Bantu pengelolaan operasional harian rumah tahfidz Anda dengan Halaqah ID. Laporan perkembangan dikirim instan langsung ke WhatsApp wali murid.",
  },
  "/aplikasi-pondok-pesantren": {
    title: "Sistem Informasi Tahfidz Pondok Pesantren Terintegrasi",
    subtitle: "Kurikulum tahfidz teratur, SOP kustom, penilai ujian terstruktur, dan rekapitulasi data kemajuan santri terintegrasi cloud.",
    keyword: "Aplikasi Pondok Pesantren",
    metaDesc: "Aplikasi tahfidz terbaik untuk pondok pesantren. Kelola kurikulum hafalan, target setoran juz, dan rekap nilai rapor tahfidz santri digital.",
  },
  "/aplikasi-tpq": {
    title: "Aplikasi Administrasi Tahfidz TPQ / TPA Ramah Pengguna",
    subtitle: "Pencatatan sabaq, sabqi, manzil santri secara ringkas. Desain super ringan yang mudah digunakan oleh guru ngaji.",
    keyword: "Aplikasi TPQ",
    metaDesc: "Permudah administrasi kelas mengaji TPQ dengan Halaqah ID. Catat absensi kehadiran dan setoran surah pendek santri kurang dari 10 detik.",
  },
  "/aplikasi-setoran-hafalan": {
    title: "Aplikasi Setoran Hafalan Quran Praktis & Real-time",
    subtitle: "Pencatatan surat, ayat, juz, nilai ketepatan tajwid, dan kelancaran setoran hafalan santri secara cepat.",
    keyword: "Aplikasi Setoran Hafalan",
    metaDesc: "Platform pencatatan kartu setoran hafalan Quran santri digital. Data tersimpan aman di cloud dan dapat dipantau orang tua kapan saja.",
  },
  "/administrasi-tahfidz": {
    title: "Aplikasi Administrasi Tahfidz & Ujian Quran Terstruktur",
    subtitle: "Cetak rapor tahfidz PDF, buat kartu setoran digital, kelola trash data, dan rekap log audit operasional pengajar.",
    keyword: "Administrasi Tahfidz",
    metaDesc: "Rapikan administrasi tahfidz di lembaga Anda. Cetak laporan PDF perkembangan santri dan kelola data master tanpa repot.",
  },
  "/monitoring-hafalan-santri": {
    title: "Aplikasi Monitoring Hafalan Santri Terlengkap",
    subtitle: "Dashboard grafik kemajuan, rekap harian wali murid, notifikasi gateway WA, dan monitoring kurikulum terpusat.",
    keyword: "Monitoring Hafalan Santri",
    metaDesc: "Halaqah ID adalah aplikasi monitoring hafalan santri paling terpercaya untuk mendeteksi dini kemunduran atau akselerasi hafalan santri.",
  },
};

export default function LandingPage() {
  const location = useLocation();
  const [dbSections, setDbSections] = useState<Record<string, any>>({});

  // Detect matching SEO keyword from path config
  const path = location.pathname;
  const config = KEYWORD_CONFIGS[path] || {
    title: "Aplikasi Halaqah & Tahfidz Quran Modern",
    subtitle: "Solusi digital terbaik untuk mengaktifkan monitoring hafalan santri secara real-time, pencatatan setoran, dan laporan progres otomatis.",
    keyword: "Aplikasi Halaqah",
    metaDesc: "Halaqah ID adalah sistem manajemen halaqah dan monitoring hafalan santri terbaik untuk pondok pesantren, rumah tahfidz, dan sekolah Islam.",
  };

  useEffect(() => {
    // Fetch landing page configs from DB if they exist
    const fetchSections = async () => {
      try {
        const res = await axios.get("/api/landing/sections");
        if (res.data && res.data.success) {
          const map: Record<string, any> = {};
          res.data.data.forEach((sec: any) => {
            map[sec.section_key] = sec;
          });
          setDbSections(map);
        }
      } catch (e) {
        console.warn("Gagal mengambil section landing page, menggunakan default:", e);
      }
    };

    fetchSections();
  }, []);

  // Construct structured JSON-LD schemas
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Halaqah ID",
    "url": "https://halaqah-id.vercel.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://halaqah-id.vercel.app/blog?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Halaqah ID",
    "operatingSystem": "All",
    "applicationCategory": "EducationalApplication",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "120",
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "IDR",
    },
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Halaqah ID",
    "url": "https://halaqah-id.vercel.app",
    "logo": "https://halaqah-id.vercel.app/logo.png",
    "sameAs": [
      "https://facebook.com/halaqahid",
      "https://instagram.com/halaqahid",
    ],
  };

  // Determine actual rendered strings (DB-overridden or keyword default)
  const heroTitle = dbSections["hero"]?.title || config.title;
  const heroSubtitle = dbSections["hero"]?.subtitle || config.subtitle;

  return (
    <div className="flex flex-col min-h-screen text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-950 font-sans">
      <SEO
        title={heroTitle}
        description={config.metaDesc}
        keywords={`${config.keyword.toLowerCase()}, aplikasi halaqah, aplikasi tahfidz, monitoring hafalan, setoran hafalan quran`}
        jsonLd={[websiteSchema, softwareSchema, orgSchema]}
      />

      <Header />
      
      <main className="flex-1">
        <Hero title={heroTitle} subtitle={heroSubtitle} keyword={config.keyword} />
        
        {/* Penjelasan */}
        {(!dbSections["description"] || dbSections["description"]?.is_active) && (
          <Description />
        )}

        {/* Keunggulan */}
        {(!dbSections["advantages"] || dbSections["advantages"]?.is_active) && (
          <Advantages />
        )}

        {/* Fitur */}
        {(!dbSections["features"] || dbSections["features"]?.is_active) && (
          <Features />
        )}

        {/* Cara Kerja */}
        {(!dbSections["howitworks"] || dbSections["howitworks"]?.is_active) && (
          <HowItWorks />
        )}

        {/* Testimoni */}
        {(!dbSections["testimonials"] || dbSections["testimonials"]?.is_active) && (
          <Testimonials />
        )}

        {/* FAQ */}
        {(!dbSections["faq"] || dbSections["faq"]?.is_active) && (
          <FaqSection />
        )}

        {/* Blog Preview */}
        {(!dbSections["blogpreview"] || dbSections["blogpreview"]?.is_active) && (
          <BlogPreview />
        )}

        {/* CTA Akhir */}
        {(!dbSections["cta"] || dbSections["cta"]?.is_active) && (
          <CtaSection />
        )}
      </main>

      <Footer />
    </div>
  );
}
