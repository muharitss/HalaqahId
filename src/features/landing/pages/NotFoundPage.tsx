import { Link } from "react-router-dom";
import { SEO } from "@/components/custom/seo/SEO";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground px-6 py-12 text-center">
      <SEO
        title="Halaman Tidak Ditemukan - 404 Error"
        description="Maaf, halaman yang Anda cari tidak dapat ditemukan. Kembali ke halaman utama Halaqah ID."
        robots="noindex, nofollow"
      />

      <div className="flex flex-col items-center justify-center text-sm max-md:px-4">
        <h1 className="text-8xl md:text-9xl font-bold text-primary">404</h1>
        <div className="h-1 w-16 rounded bg-primary my-5 md:my-7"></div>
        <p className="text-2xl md:text-3xl font-bold text-foreground">Halaman Tidak Ditemukan</p>
        <p className="text-sm md:text-base mt-4 text-muted-foreground max-w-md text-center">
          Halaman yang Anda cari mungkin telah dihapus, mengalami perubahan nama, atau tidak tersedia untuk sementara waktu.
        </p>
        <div className="flex items-center gap-4 mt-6">
          <Link
            to="/"
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-7 py-2.5 rounded-md active:scale-95 transition-all text-sm"
          >
            Kembali ke Beranda
          </Link>
          <Link
            to="/contact"
            className="border border-border px-7 py-2.5 text-foreground font-semibold rounded-md active:scale-95 transition-all hover:bg-accent dark:hover:bg-muted text-sm"
          >
            Hubungi Support
          </Link>
        </div>
      </div>
    </div>
  );
}

