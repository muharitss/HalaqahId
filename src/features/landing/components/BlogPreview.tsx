import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User, Clock } from "lucide-react";
import axios from "axios";

interface BlogPostSummary {
  id_post: number;
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
  reading_time: number;
  thumbnail?: string;
  category?: { name: string; slug: string };
  author?: { name: string };
}

export const BlogPreview: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const res = await axios.get("/api/blog/posts?limit=3");
        if (res.data && res.data.success && res.data.data.posts) {
          setPosts(res.data.data.posts);
        }
      } catch (error) {
        console.error("Gagal mengambil preview artikel blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4 text-left">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
              ARTIKEL TERBARU
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Wawasan & Edukasi Pengelolaan Tahfidz
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Dapatkan info terkini, tips, dan strategi mengajar Al-Quran secara efektif dari para praktisi pendidikan tahfidz berpengalaman.
            </p>
          </div>

          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-bold text-base shrink-0 transition-colors"
          >
            <span>Lihat Semua Artikel</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-50 dark:bg-slate-950/50 rounded-2xl h-80 border border-slate-100 dark:border-slate-800" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          /* Empty / Fallback Mockup cards to keep the UI beautiful before any blog posts are written */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Cara Efektif Mengelola Setoran Hafalan Al-Quran Santri",
                slug: "cara-mengelola-setoran-hafalan",
                excerpt: "Simak kiat-kiat praktis meningkatkan motivasi santri agar setoran hafalan harian berjalan lancar dan konsisten.",
                date: new Date().toISOString(),
                time: 5,
                category: "Tips Mengajar",
              },
              {
                title: "Mengapa Rumah Tahfidz Perlu Beralih ke Sistem Digital?",
                slug: "digitalisasi-rumah-tahfidz",
                excerpt: "Analisis perbandingan efisiensi pencatatan manual vs aplikasi tahfidz digital untuk kemajuan pelaporan wali murid.",
                date: new Date().toISOString(),
                time: 4,
                category: "Manajemen",
              },
              {
                title: "Tips Sukses Menghadapi Ujian Tahfidz Quran Metode Kustom",
                slug: "sukses-ujian-tahfidz",
                excerpt: "Bagaimana merancang kriteria kelulusan ujian tahfidz yang adil dan memacu semangat juang hafalan anak didik.",
                date: new Date().toISOString(),
                time: 6,
                category: "Kurikulum",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden text-left flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-6 space-y-4">
                  <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg">
                    {item.category}
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-snug hover:text-primary transition-colors">
                    <Link to={`/blog/${item.slug}`}>{item.title}</Link>
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {item.excerpt}
                  </p>
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{formatDate(item.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{item.time} Menit</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Real Data Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post.id_post}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden text-left flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div>
                  {post.thumbnail && (
                    <img src={post.thumbnail} alt={post.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6 space-y-4">
                    {post.category && (
                      <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg">
                        {post.category.name}
                      </span>
                    )}
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-snug hover:text-primary transition-colors line-clamp-2">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>{post.author?.name || "Admin"}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(post.published_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {post.reading_time} Min
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
