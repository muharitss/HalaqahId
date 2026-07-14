import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SEO } from "@/components/custom/seo/SEO";
import { Header } from "@/features/landing/components/Header";
import { Footer } from "@/features/landing/components/Footer";
import { Search, Calendar, User, Clock, ChevronRight } from "lucide-react";
import axios from "axios";

interface BlogPost {
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

interface Category {
  id_category: number;
  name: string;
  slug: string;
}

interface Tag {
  id_tag: number;
  name: string;
  slug: string;
}

export default function BlogListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Search & filter query variables
  const searchQuery = searchParams.get("search") || "";
  const categoryQuery = searchParams.get("category") || "";
  const tagQuery = searchParams.get("tag") || "";
  const pageQuery = parseInt(searchParams.get("page") || "1");

  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    // Fetch categories and tags once
    const fetchMetadata = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          axios.get("/api/blog/categories"),
          axios.get("/api/blog/tags"),
        ]);
        if (catRes.data && catRes.data.success) setCategories(catRes.data.data);
        if (tagRes.data && tagRes.data.success) setTags(tagRes.data.data);
      } catch (e) {
        console.error("Gagal memuat metadata blog:", e);
      }
    };

    fetchMetadata();
  }, []);

  useEffect(() => {
    // Fetch posts based on filters
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params: any = { page: pageQuery, limit: 9 };
        if (searchQuery) params.search = searchQuery;
        if (categoryQuery) params.category = categoryQuery;
        if (tagQuery) params.tag = tagQuery;

        const res = await axios.get("/api/blog/posts", { params });
        if (res.data && res.data.success) {
          setPosts(res.data.data.posts);
          setTotal(res.data.data.total);
        }
      } catch (e) {
        console.error("Gagal memuat daftar artikel:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchQuery, categoryQuery, tagQuery, pageQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams((prev) => {
      if (searchInput) {
        prev.set("search", searchInput);
      } else {
        prev.delete("search");
      }
      prev.set("page", "1");
      return prev;
    });
  };

  const handleCategorySelect = (slug: string) => {
    setSearchParams((prev) => {
      if (slug) {
        prev.set("category", slug);
      } else {
        prev.delete("category");
      }
      prev.delete("tag"); // clear tag filter when category changes
      prev.set("page", "1");
      return prev;
    });
  };

  const handleTagSelect = (slug: string) => {
    setSearchParams((prev) => {
      if (slug) {
        prev.set("tag", slug);
      } else {
        prev.delete("tag");
      }
      prev.delete("category"); // clear category filter when tag changes
      prev.set("page", "1");
      return prev;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  const totalPages = Math.ceil(total / 9);

  return (
    <div className="flex flex-col min-h-screen text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-950">
      <SEO
        title="Blog & Wawasan Tahfidz Quran"
        description="Temukan wawasan terbaru, panduan praktis pengelolaan halaqah, dan artikel inspiratif tentang pembelajaran tahfidz Al-Quran."
        keywords="blog tahfidz, tips mengajar quran, halaqah id blog"
      />

      <Header />

      <main className="flex-1 py-12 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-bold">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-slate-600 dark:text-slate-300">Blog</span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
              Blog & Artikel Halaqah ID
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              Kumpulan panduan, ulasan teknologi, dan tips asatidz untuk meningkatkan standar dan efisiensi program tahfidzul Quran lembaga Anda.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
            
            {/* Left sidebar filters */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Search form */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Cari artikel..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              </form>

              {/* Categories */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wider">Kategori</h4>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleCategorySelect("")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                      !categoryQuery && !tagQuery
                        ? "bg-primary text-white"
                        : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    Semua Kategori
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id_category}
                      onClick={() => handleCategorySelect(cat.slug)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                        categoryQuery === cat.slug
                          ? "bg-primary text-white"
                          : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wider">Tag Populer</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id_tag}
                      onClick={() => handleTagSelect(tag.slug)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        tagQuery === tag.slug
                          ? "bg-primary text-white"
                          : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800/50"
                      }`}
                    >
                      #{tag.name}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right main posts area */}
            <div className="lg:col-span-9">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-slate-50 dark:bg-slate-900 border rounded-2xl h-80" />
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="py-20 text-center border border-dashed rounded-3xl space-y-4">
                  <p className="text-slate-400 font-bold text-lg">Tidak ada artikel ditemukan</p>
                  <p className="text-xs text-slate-550">Coba ganti filter pencarian atau kategori Anda.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Posts Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                      <div
                        key={post.id_post}
                        className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <div>
                          {post.thumbnail && (
                            <img src={post.thumbnail} alt={post.title} className="w-full h-44 object-cover" />
                          )}
                          <div className="p-5 space-y-3">
                            {post.category && (
                              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-md">
                                {post.category.name}
                              </span>
                            )}
                            <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug line-clamp-2 hover:text-primary transition-colors">
                              <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                            </h3>
                            <p className="text-slate-500 dark:text-slate-450 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                              {post.excerpt}
                            </p>
                          </div>
                        </div>

                        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-bold">
                          <div className="flex items-center gap-1.5 truncate max-w-[120px]">
                            <User size={12} />
                            <span className="truncate">{post.author?.name || "Admin"}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {formatDate(post.published_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {post.reading_time} Min
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-6">
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        const isCurrent = pageNum === pageQuery;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                              isCurrent
                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                : "bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                  )}

                </div>
              )}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
