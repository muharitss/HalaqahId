import { SEO } from "@/components/custom/seo/SEO";
import { Header } from "../components/Header";
import { FaqSection } from "../components/FaqSection";
import { Footer } from "../components/Footer";

export default function FaqPage() {
  return (
    <div className="flex flex-col min-h-screen text-foreground bg-background">
      <SEO
        title="Tanya Jawab (FAQ) - Pusat Informasi Halaqah ID"
        description="Temukan jawaban cepat atas pertanyaan seputar fitur, lisensi, integrasi Fonnte WhatsApp, keamanan database cloud, dan cara impor data santri."
        keywords="faq halaqah id, cara impor data santri, harga software tahfidz"
      />

      <Header />

      <main className="flex-1">
        <FaqSection />
      </main>

      <Footer />
    </div>
  );
}
