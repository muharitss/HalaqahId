import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { SEO } from "@/components/custom/seo/SEO";
import { Header } from "@/features/landing/components/Header";
import { Footer } from "@/features/landing/components/Footer";
import { Calendar, Clock, ChevronRight, Share2, Eye, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface BlogPostDetail {
  id_post: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  published_at: string;
  reading_time: number;
  view_count: number;
  thumbnail?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  canonical_url?: string;
  og_image?: string;
  category?: { name: string; slug: string };
  author?: { name: string; email: string };
  tags?: { tag: { name: string; slug: string } }[];
}

interface TocItem {
  id: string;
  text: string;
}

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<{
    post: BlogPostDetail;
    related: BlogPostDetail[];
    prevNext: { prev: BlogPostDetail | null; next: BlogPostDetail | null };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [toc, setToc] = useState<TocItem[]>([]);

  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await axios.get(`/api/blog/posts/${slug}`);
        if (res.data && res.data.success) {
          setData(res.data.data);
          generateToc(res.data.data.post.content);
        } else {
          navigate("/404");
        }
      } catch (error) {
        console.error("Gagal memuat detail artikel:", error);
        navigate("/404");
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [slug, navigate]);

  // Generate Table of Contents by parsing H2 headings in content
  const generateToc = (htmlContent: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const headings = doc.querySelectorAll("h2");
    const items: TocItem[] = [];

    headings.forEach((heading, idx) => {
      // Assign an ID if not exists
      const text = heading.textContent || "";
      const id = heading.id || `heading-${idx}`;
      heading.id = id;
      items.push({ id, text });
    });

    setToc(items);
  };

  // Modify HTML to inject IDs into H2 tags for anchor links to work
  const getParsedContent = (htmlContent: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const headings = doc.querySelectorAll("h2");
    
    headings.forEach((heading, idx) => {
      heading.id = `heading-${idx}`;
    });

    return doc.body.innerHTML;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  const shareLink = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(data?.post.title || "");

    let shareUrl = "";
    switch (platform) {
      case "wa":
        shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
        break;
      case "fb":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "tw":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case "copy":
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link berhasil disalin ke clipboard!");
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm mt-4">Memuat artikel...</p>
      </div>
    );
  }

  if (!data) return null;

  const { post, related, prevNext } = data;

  // JSON-LD Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.title,
    "image": [
      post.thumbnail || post.og_image || "https://halaqah-id.vercel.app/og-image-default.png",
    ],
    "datePublished": post.published_at,
    "dateModified": post.published_at,
    "author": {
      "@type": "Person",
      "name": post.author?.name || "Admin",
      "email": post.author?.email || "support@halaqah.id",
    },
  };

  return (
    <div className="flex flex-col min-h-screen text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-950">
      <SEO
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt}
        keywords={post.meta_keywords}
        canonical={post.canonical_url}
        ogTitle={post.title}
        ogDescription={post.meta_description || post.excerpt}
        ogImage={post.og_image || post.thumbnail}
        jsonLd={articleSchema}
      />

      <Header />

      <main className="flex-1 py-12 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-400 font-bold mb-8">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
            {post.category && (
              <>
                <ChevronRight size={14} />
                <Link to={`/blog?category=${post.category.slug}`} className="hover:text-primary transition-colors">
                  {post.category.name}
                </Link>
              </>
            )}
            <ChevronRight size={14} />
            <span className="text-slate-500 max-w-[200px] truncate">{post.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Article Content */}
            <article className="lg:col-span-8 space-y-8">
              
              {/* Category & Title */}
              <div className="space-y-4">
                {post.category && (
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-black uppercase rounded-lg">
                    {post.category.name}
                  </span>
                )}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                  {post.title}
                </h1>
              </div>

              {/* Author & Meta */}
              <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-400 border-y border-slate-100 dark:border-slate-800/80 py-4 font-bold">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                    {post.author?.name?.[0]?.toUpperCase() || "A"}
                  </div>
                  <span>{post.author?.name || "Admin"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>{formatDate(post.published_at)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  <span>{post.reading_time} Menit Baca</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye size={14} />
                  <span>{post.view_count} Dilihat</span>
                </div>
              </div>

              {/* Featured Image */}
              {post.thumbnail && (
                <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200/20">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full max-h-[460px] object-cover hover:scale-101 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Article HTML Content */}
              <div
                className="prose prose-slate dark:prose-invert max-w-none prose-sm sm:prose-base leading-relaxed text-slate-650 dark:text-slate-300
                  prose-headings:font-black prose-headings:text-slate-900 prose-headings:dark:text-white
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-150 prose-h2:dark:border-slate-800
                  prose-p:mt-4 prose-p:mb-4
                  prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-950/20 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:italic
                  prose-code:text-primary prose-code:bg-primary/5 prose-code:p-1 prose-code:rounded prose-code:text-xs
                  prose-table:border-collapse prose-table:w-full prose-table:my-6
                  prose-th:border prose-th:border-slate-200 dark:prose-th:border-slate-800 prose-th:bg-slate-50 dark:prose-th:bg-slate-950 prose-th:p-3 prose-th:text-xs prose-th:font-bold
                  prose-td:border prose-td:border-slate-200 dark:prose-td:border-slate-800 prose-td:p-3 prose-td:text-xs
                "
                dangerouslySetInnerHTML={{ __html: getParsedContent(post.content) }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-100 dark:border-slate-850">
                  {post.tags.map((t, i) => (
                    <Link
                      key={i}
                      to={`/blog?tag=${t.tag.slug}`}
                      className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 rounded-lg border border-slate-200/50 dark:border-slate-800/50 transition-colors"
                    >
                      #{t.tag.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Share section */}
              <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="font-bold text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <Share2 size={16} />
                  Bagikan Artikel Ini:
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => shareLink("wa")}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow transition-colors"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => shareLink("fb")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition-colors"
                  >
                    Facebook
                  </button>
                  <button
                    onClick={() => shareLink("tw")}
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow transition-colors"
                  >
                    Twitter
                  </button>
                  <button
                    onClick={() => shareLink("copy")}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-705 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors"
                  >
                    Salin Link
                  </button>
                </div>
              </div>

              {/* Prev / Next widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-850 pt-8">
                {prevNext.prev ? (
                  <Link
                    to={`/blog/${prevNext.prev.slug}`}
                    className="p-5 border border-slate-200/50 dark:border-slate-800/50 hover:border-primary/50 dark:hover:border-primary/50 rounded-2xl text-left space-y-2 hover:-translate-y-0.5 transition-all group"
                  >
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 group-hover:text-primary transition-colors">
                      <ArrowLeft size={10} /> Artikel Sebelumnya
                    </span>
                    <h4 className="font-bold text-sm text-slate-850 dark:text-slate-200 line-clamp-2">
                      {prevNext.prev.title}
                    </h4>
                  </Link>
                ) : (
                  <div className="p-5 border border-dashed rounded-2xl text-slate-400 text-xs flex items-center justify-center">
                    Tidak ada artikel sebelumnya
                  </div>
                )}

                {prevNext.next ? (
                  <Link
                    to={`/blog/${prevNext.next.slug}`}
                    className="p-5 border border-slate-200/50 dark:border-slate-800/50 hover:border-primary/50 dark:hover:border-primary/50 rounded-2xl text-right space-y-2 hover:-translate-y-0.5 transition-all group"
                  >
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 justify-end group-hover:text-primary transition-colors">
                      Artikel Selanjutnya <ArrowRight size={10} />
                    </span>
                    <h4 className="font-bold text-sm text-slate-850 dark:text-slate-200 line-clamp-2">
                      {prevNext.next.title}
                    </h4>
                  </Link>
                ) : (
                  <div className="p-5 border border-dashed rounded-2xl text-slate-400 text-xs flex items-center justify-center">
                    Tidak ada artikel selanjutnya
                  </div>
                )}
              </div>

            </article>

            {/* Right Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              
              {/* Table of Contents (TOC) */}
              {toc.length > 0 && (
                <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl text-left space-y-4 sticky top-24">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
                    Daftar Isi (TOC)
                  </h4>
                  <nav className="flex flex-col gap-2.5">
                    {toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(item.id);
                          if (el) {
                            el.scrollIntoView({ behavior: "smooth", block: "start" });
                          }
                        }}
                        className="text-xs sm:text-sm text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors line-clamp-1 leading-snug"
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Related articles */}
              {related && related.length > 0 && (
                <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl text-left space-y-4">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
                    Artikel Terkait
                  </h4>
                  <div className="flex flex-col gap-4">
                    {related.map((post) => (
                      <div key={post.id_post} className="space-y-1">
                        <h5 className="font-bold text-xs sm:text-sm text-slate-850 dark:text-white hover:text-primary transition-colors line-clamp-2 leading-snug">
                          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                        </h5>
                        <p className="text-[10px] text-slate-400">
                          {formatDate(post.published_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </aside>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
