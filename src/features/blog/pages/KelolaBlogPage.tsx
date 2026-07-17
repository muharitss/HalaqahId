import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Tag as TagIcon,
  FolderOpen,
  FileText,
  Search,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import { TiptapEditor } from "../components/TiptapEditor";

interface BlogPost {
  id_post: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  thumbnail?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  canonical_url?: string;
  og_image?: string;
  status: string; // "DRAFT" | "PUBLISHED"
  featured: boolean;
  published_at?: string;
  created_at: string;
  deleted_at?: string | null;
  category?: { id_category: number; name: string };
  tags?: { tag: { id_tag: number; name: string } }[];
  author?: { name: string };
}

interface Category {
  id_category: number;
  name: string;
  slug: string;
  description?: string;
}

interface Tag {
  id_tag: number;
  name: string;
  slug: string;
}

export default function KelolaBlogPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"posts" | "categories" | "tags" | "editor">("posts");
  
  // Data States
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  // Editor States
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [categoryId, setCategoryId] = useState<string>("none");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [status, setStatus] = useState("DRAFT");
  const [featured, setFeatured] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");

  // Categories & Tags Editor States
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [tagName, setTagName] = useState("");
  const [tagSlug, setTagSlug] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [postRes, catRes, tagRes] = await Promise.all([
        axios.get("/api/blog/admin/posts"),
        axios.get("/api/blog/categories"),
        axios.get("/api/blog/tags"),
      ]);

      if (postRes.data && postRes.data.success) setPosts(postRes.data.data);
      if (catRes.data && catRes.data.success) setCategories(catRes.data.data);
      if (tagRes.data && tagRes.data.success) setTags(tagRes.data.data);
    } catch (e) {
      toast.error("Gagal mengambil data dari database");
    } finally {
      setLoading(false);
    }
  };

  // Helper to sync title to slug
  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-") // collapse dashes
      .trim();
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPostId) {
      setSlug(generateSlug(val));
    }
  };

  const handleOpenNewPost = () => {
    setEditingPostId(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setThumbnail("");
    setCategoryId("none");
    setSelectedTagIds([]);
    setStatus("DRAFT");
    setFeatured(false);
    setMetaTitle("");
    setMetaDesc("");
    setMetaKeywords("");
    setCanonicalUrl("");
    setOgImage("");
    setTargetKeyword("");
    setActiveTab("editor");
  };

  const handleOpenEditPost = (post: BlogPost) => {
    setEditingPostId(post.id_post);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt || "");
    setContent(post.content);
    setThumbnail(post.thumbnail || "");
    setCategoryId(post.category ? post.category.id_category.toString() : "none");
    setSelectedTagIds(post.tags ? post.tags.map((t) => t.tag.id_tag) : []);
    setStatus(post.status);
    setFeatured(post.featured);
    setMetaTitle(post.meta_title || "");
    setMetaDesc(post.meta_description || "");
    setMetaKeywords(post.meta_keywords || "");
    setCanonicalUrl(post.canonical_url || "");
    setOgImage(post.og_image || "");
    setTargetKeyword("");
    setActiveTab("editor");
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content) {
      toast.error("Judul, slug, dan konten wajib diisi");
      return;
    }

    const payload = {
      title,
      slug,
      excerpt,
      content,
      thumbnail,
      meta_title: metaTitle,
      meta_description: metaDesc,
      meta_keywords: metaKeywords,
      canonical_url: canonicalUrl,
      og_image: ogImage,
      status,
      featured,
      id_category: categoryId === "none" ? null : parseInt(categoryId),
      tagIds: selectedTagIds,
    };

    try {
      if (editingPostId) {
        await axios.put(`/api/blog/admin/posts/${editingPostId}`, payload);
        toast.success("Artikel berhasil diperbarui!");
      } else {
        await axios.post("/api/blog/admin/posts", payload);
        toast.success("Artikel baru berhasil dibuat!");
      }
      fetchData();
      setActiveTab("posts");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyimpan artikel");
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) return;
    try {
      await axios.delete(`/api/blog/admin/posts/${id}`);
      toast.success("Artikel berhasil dihapus");
      fetchData();
    } catch (e) {
      toast.error("Gagal menghapus artikel");
    }
  };

  const handleRestorePost = async (id: number) => {
    try {
      await axios.post(`/api/blog/admin/posts/${id}/restore`);
      toast.success("Artikel berhasil dipulihkan");
      fetchData();
    } catch (e) {
      toast.error("Gagal memulihkan artikel");
    }
  };

  // --- Category Handlers ---
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName || !catSlug) return;
    try {
      await axios.post("/api/blog/admin/categories", {
        name: catName,
        slug: catSlug,
        description: catDesc,
      });
      toast.success("Kategori baru berhasil ditambahkan!");
      setCatName("");
      setCatSlug("");
      setCatDesc("");
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyimpan kategori");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Hapus kategori ini?")) return;
    try {
      await axios.delete(`/api/blog/admin/categories/${id}`);
      toast.success("Kategori berhasil dihapus");
      fetchData();
    } catch (e) {
      toast.error("Gagal menghapus kategori");
    }
  };

  // --- Tag Handlers ---
  const handleSaveTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName || !tagSlug) return;
    try {
      await axios.post("/api/blog/admin/tags", {
        name: tagName,
        slug: tagSlug,
      });
      toast.success("Tag baru berhasil ditambahkan!");
      setTagName("");
      setTagSlug("");
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyimpan tag");
    }
  };

  const handleDeleteTag = async (id: number) => {
    if (!confirm("Hapus tag ini?")) return;
    try {
      await axios.delete(`/api/blog/admin/tags/${id}`);
      toast.success("Tag berhasil dihapus");
      fetchData();
    } catch (e) {
      toast.error("Gagal menghapus tag");
    }
  };

  const handleTagToggle = (id: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id]
    );
  };

  // --- SEO AUDIT ENGINE ---
  const runSeoAudit = () => {
    const warnings: string[] = [];
    const passes: string[] = [];

    // Title length checks
    if (!metaTitle) {
      warnings.push("Meta Title belum diisi (menggunakan judul artikel default)");
    } else {
      if (metaTitle.length < 30) warnings.push("Meta Title terlalu pendek (< 30 karakter)");
      else if (metaTitle.length > 60) warnings.push("Meta Title terlalu panjang (> 60 karakter)");
      else passes.push("Panjang Meta Title optimal");
    }

    // Description checks
    if (!metaDesc) {
      warnings.push("Meta Description belum diisi");
    } else {
      if (metaDesc.length < 80) warnings.push("Meta Description terlalu pendek (< 80 karakter)");
      else if (metaDesc.length > 160) warnings.push("Meta Description terlalu panjang (> 160 karakter)");
      else passes.push("Panjang Meta Description optimal");
    }

    // Heading structure checks
    if (!title) {
      warnings.push("Tidak ada Judul Utama / H1");
    } else {
      passes.push("Struktur H1 terdeteksi");
    }

    // Canonical url check
    if (!canonicalUrl) {
      warnings.push("Canonical URL kosong (otomatis fallback ke URL artikel)");
    } else {
      passes.push("Canonical URL dikonfigurasi");
    }

    // Thumbnail/Featured image checks
    if (!thumbnail) {
      warnings.push("Featured Image / Thumbnail kosong");
    } else {
      passes.push("Featured Image terlampir");
    }

    // Content checks (images alt)
    if (content) {
      const hasImages = content.includes("<img");
      const hasImagesWithoutAlt = content.includes("<img") && !content.includes("alt=");
      if (hasImages && hasImagesWithoutAlt) {
        warnings.push("Terdapat gambar di konten yang tidak memiliki tag ALT");
      } else if (hasImages) {
        passes.push("Semua gambar dalam konten memiliki tag ALT");
      }
    }

    // Target keyword density check
    if (targetKeyword) {
      const kw = targetKeyword.toLowerCase();
      const titleOk = title.toLowerCase().includes(kw);
      const descOk = metaDesc.toLowerCase().includes(kw);
      const contentOk = content.toLowerCase().includes(kw);

      if (!titleOk) warnings.push(`Kata kunci "${targetKeyword}" tidak ditemukan di Judul`);
      if (!descOk) warnings.push(`Kata kunci "${targetKeyword}" tidak ditemukan di Meta Description`);
      if (!contentOk) warnings.push(`Kata kunci "${targetKeyword}" tidak ditemukan di konten artikel`);

      if (titleOk && descOk && contentOk) {
        passes.push(`Kata kunci "${targetKeyword}" dioptimasi dengan baik di semua bagian`);
      }
    }

    // Calculate score
    const totalChecks = warnings.length + passes.length;
    const score = totalChecks > 0 ? Math.round((passes.length / totalChecks) * 100) : 0;

    return { score, warnings, passes };
  };

  const seoAudit = runSeoAudit();

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 text-left">
      
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => navigate("/superadmin")}
            className="rounded-full h-10 w-10 shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Content Management & Blog</h1>
            <p className="text-muted-foreground text-sm">
              Buat artikel promosi, tips tahfidz, kelola kategori, tag, dan optimasi metadata SEO web utama.
            </p>
          </div>
        </div>

        {activeTab !== "editor" && (
          <Button onClick={handleOpenNewPost} className="flex items-center gap-2">
            <Plus size={16} />
            <span>Tulis Artikel Baru</span>
          </Button>
        )}
      </div>

      {/* TABS SELECTOR */}
      {activeTab !== "editor" && (
        <div className="flex gap-2 bg-muted/30 p-1 rounded-xl w-fit">
          <Button
            variant={activeTab === "posts" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("posts")}
            className="rounded-lg text-xs font-bold"
          >
            <FileText size={14} className="mr-1.5" />
            Daftar Artikel
          </Button>
          <Button
            variant={activeTab === "categories" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("categories")}
            className="rounded-lg text-xs font-bold"
          >
            <FolderOpen size={14} className="mr-1.5" />
            Kategori
          </Button>
          <Button
            variant={activeTab === "tags" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("tags")}
            className="rounded-lg text-xs font-bold"
          >
            <TagIcon size={14} className="mr-1.5" />
            Tag
          </Button>
        </div>
      )}

      {/* --- TAB CONTENT: LIST ARTICLES --- */}
      {activeTab === "posts" && (
        <Card className="border border-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Semua Artikel Blog</CardTitle>
            <CardDescription>Daftar seluruh draft, artikel terbit, dan arsip di sistem.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-slate-400">Loading data...</div>
            ) : posts.length === 0 ? (
              <div className="py-12 text-center text-slate-400 border border-dashed rounded-2xl">
                Belum ada artikel. Klik tombol "Tulis Artikel Baru" di atas.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b text-slate-400 font-bold uppercase text-[10px] tracking-wider text-left bg-slate-50 dark:bg-slate-900/50">
                      <th className="p-3">Judul Artikel</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Penulis</th>
                      <th className="p-3">Tanggal Dibuat</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {posts.map((post) => (
                      <tr
                        key={post.id_post}
                        className={`hover:bg-slate-50/50 dark:hover:bg-slate-900/30 ${
                          post.deleted_at ? "opacity-50 bg-red-50/20" : ""
                        }`}
                      >
                        <td className="p-3 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                          {post.title}
                          {post.featured && (
                            <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 text-[9px] font-black rounded uppercase">
                              Unggulan
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-550">
                          {post.category?.name || <span className="text-slate-300">-</span>}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-black rounded uppercase ${
                              post.status === "PUBLISHED"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                                : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {post.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 font-medium">{post.author?.name}</td>
                        <td className="p-3 text-slate-400 text-xs">
                          {new Date(post.created_at).toLocaleDateString("id-ID")}
                        </td>
                        <td className="p-3 text-right space-x-1 shrink-0">
                          {post.deleted_at ? (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-emerald-600"
                                onClick={() => handleRestorePost(post.id_post)}
                                title="Restore"
                              >
                                <RefreshCw size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-650"
                                onClick={() => handleDeletePost(post.id_post)}
                                title="Delete Permanently"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-primary"
                                onClick={() => handleOpenEditPost(post)}
                                title="Edit"
                              >
                                <Edit2 size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600"
                                onClick={() => handleDeletePost(post.id_post)}
                                title="Move to Trash"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* --- TAB CONTENT: CATEGORIES --- */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Add Category Form */}
          <div className="lg:col-span-4">
            <Card className="border border-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Tambah Kategori</CardTitle>
                <CardDescription>Buat kategori blog baru.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveCategory} className="space-y-4 text-left">
                  <div className="space-y-2">
                    <Label htmlFor="catName">Nama Kategori</Label>
                    <Input
                      id="catName"
                      value={catName}
                      onChange={(e) => {
                        setCatName(e.target.value);
                        setCatSlug(generateSlug(e.target.value));
                      }}
                      placeholder="Contoh: Tips & Trik"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="catSlug">Slug Kategori</Label>
                    <Input
                      id="catSlug"
                      value={catSlug}
                      onChange={(e) => setCatSlug(generateSlug(e.target.value))}
                      placeholder="tips-dan-trik"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="catDesc">Deskripsi Kategori</Label>
                    <Input
                      id="catDesc"
                      value={catDesc}
                      onChange={(e) => setCatDesc(e.target.value)}
                      placeholder="Kumpulan tips bagi asatidz..."
                    />
                  </div>
                  <Button type="submit" className="w-full font-bold">
                    Simpan Kategori
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Categories list */}
          <div className="lg:col-span-8">
            <Card className="border border-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Daftar Kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b text-slate-400 font-bold uppercase text-[10px] tracking-wider text-left bg-slate-50 dark:bg-slate-900/50">
                        <th className="p-3">Nama Kategori</th>
                        <th className="p-3">Slug</th>
                        <th className="p-3">Deskripsi</th>
                        <th className="p-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {categories.map((cat) => (
                        <tr key={cat.id_category} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                          <td className="p-3 font-bold text-slate-850 dark:text-white">{cat.name}</td>
                          <td className="p-3 text-slate-500 font-mono text-xs">{cat.slug}</td>
                          <td className="p-3 text-slate-400 text-xs">{cat.description || "-"}</td>
                          <td className="p-3 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600"
                              onClick={() => handleDeleteCategory(cat.id_category)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      )}

      {/* --- TAB CONTENT: TAGS --- */}
      {activeTab === "tags" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Add Tag Form */}
          <div className="lg:col-span-4">
            <Card className="border border-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Tambah Tag</CardTitle>
                <CardDescription>Buat tag postingan baru.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveTag} className="space-y-4 text-left">
                  <div className="space-y-2">
                    <Label htmlFor="tagName">Nama Tag</Label>
                    <Input
                      id="tagName"
                      value={tagName}
                      onChange={(e) => {
                        setTagName(e.target.value);
                        setTagSlug(generateSlug(e.target.value));
                      }}
                      placeholder="Contoh: Tahfidz"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagSlug">Slug Tag</Label>
                    <Input
                      id="tagSlug"
                      value={tagSlug}
                      onChange={(e) => setTagSlug(generateSlug(e.target.value))}
                      placeholder="tahfidz"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full font-bold">
                    Simpan Tag
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Tags list */}
          <div className="lg:col-span-8">
            <Card className="border border-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Daftar Tag</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 text-left">
                  {tags.map((tag) => (
                    <div
                      key={tag.id_tag}
                      className="px-3.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl text-xs font-bold text-slate-650 dark:text-slate-350 flex items-center gap-2"
                    >
                      <span>#{tag.name}</span>
                      <button
                        onClick={() => handleDeleteTag(tag.id_tag)}
                        className="text-red-500 hover:text-red-650 shrink-0 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      )}

      {/* --- TAB CONTENT: WRITE / EDIT ARTICLE EDITOR --- */}
      {activeTab === "editor" && (
        <form onSubmit={handleSavePost} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Form Fields */}
          <div className="lg:col-span-8 space-y-6 text-left">
            <Card className="border border-primary/5">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4 mb-4">
                <div>
                  <CardTitle className="text-lg">
                    {editingPostId ? "Edit Artikel" : "Tulis Artikel Baru"}
                  </CardTitle>
                  <CardDescription>Tulis konten informatif berkualitas tinggi.</CardDescription>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("posts")}
                  className="text-xs font-bold"
                >
                  Batal
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="postTitle">Judul Artikel *</Label>
                  <Input
                    id="postTitle"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Masukkan judul artikel yang menarik..."
                    required
                    className="text-base font-bold py-5"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <Label htmlFor="postSlug">Slug URL *</Label>
                  <Input
                    id="postSlug"
                    value={slug}
                    onChange={(e) => setSlug(generateSlug(e.target.value))}
                    placeholder="slug-url-artikel"
                    required
                  />
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <Label htmlFor="postExcerpt">Kutipan / Ringkasan Pendek (Excerpt)</Label>
                  <textarea
                    id="postExcerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Tulis ringkasan singkat isi artikel untuk meta description..."
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-sm focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                {/* Tiptap Rich Text Editor */}
                <div className="space-y-2">
                  <Label>Konten Utama Artikel *</Label>
                  <TiptapEditor content={content} onChange={(html) => setContent(html)} />
                </div>

              </CardContent>
            </Card>

            {/* SEO Settings card */}
            <Card className="border border-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Optimasi Metadata SEO</CardTitle>
                <CardDescription>Konfigurasi detail meta tag untuk pencarian Google & Media Sosial.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder="Masukkan judul SEO spesifik..."
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                      <span>Rekomendasi: 30-60 karakter</span>
                      <span className={metaTitle.length > 60 || metaTitle.length < 30 ? "text-amber-500" : "text-emerald-500"}>
                        {metaTitle.length} karakter
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaKeywords">Meta Keywords</Label>
                    <Input
                      id="metaKeywords"
                      value={metaKeywords}
                      onChange={(e) => setMetaKeywords(e.target.value)}
                      placeholder="tahfidz, halaqah, aplikasi quran"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDesc">Meta Description</Label>
                  <textarea
                    id="metaDesc"
                    value={metaDesc}
                    onChange={(e) => setMetaDesc(e.target.value)}
                    placeholder="Tulis deskripsi ringkas yang membujuk pencari Google mengklik halaman ini..."
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-sm focus:outline-none focus:border-primary resize-none"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>Rekomendasi: 80-160 karakter</span>
                    <span className={metaDesc.length > 160 || metaDesc.length < 80 ? "text-amber-500" : "text-emerald-500"}>
                      {metaDesc.length} karakter
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="canonicalUrl">Canonical URL</Label>
                    <Input
                      id="canonicalUrl"
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                      placeholder="https://halaqah-id.vercel.app/blog/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ogImage">Open Graph (OG) Image URL</Label>
                    <Input
                      id="ogImage"
                      value={ogImage}
                      onChange={(e) => setOgImage(e.target.value)}
                      placeholder="URL Gambar spesifik untuk Share WA/FB..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right sidebar settings & preview */}
          <div className="lg:col-span-4 space-y-6 text-left">
            
            {/* Save Card */}
            <Card className="border border-primary/5">
              <CardHeader>
                <CardTitle className="text-base">Pengaturan Artikel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Category selector */}
                <div className="space-y-2">
                  <Label htmlFor="selectCategory">Pilih Kategori</Label>
                  <Select value={categoryId} onValueChange={(val) => setCategoryId(val)}>
                    <SelectTrigger id="selectCategory">
                      <SelectValue placeholder="Pilih Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tanpa Kategori</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id_category} value={cat.id_category.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status selector */}
                <div className="space-y-2">
                  <Label htmlFor="selectStatus">Status Publikasi</Label>
                  <Select value={status} onValueChange={(val) => setStatus(val)}>
                    <SelectTrigger id="selectStatus">
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft (Disimpan Internal)</SelectItem>
                      <SelectItem value="PUBLISHED">Published (Terbit Publik)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Featured checkbox */}
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4.5 h-4.5 text-primary border-slate-300 rounded focus:ring-primary"
                  />
                  <Label htmlFor="isFeatured" className="cursor-pointer font-bold text-xs select-none">
                    Jadikan Artikel Unggulan (Featured)
                  </Label>
                </div>

                {/* Thumbnail image URL */}
                <div className="space-y-2">
                  <Label htmlFor="thumbUrl">URL Thumbnail / Image Cover</Label>
                  <Input
                    id="thumbUrl"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="https://image-url.jpg"
                  />
                </div>

                {/* Multi tags selector */}
                <div className="space-y-2">
                  <Label>Pilih Tag Postingan</Label>
                  <div className="flex flex-wrap gap-1.5 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl max-h-[140px] overflow-y-auto bg-slate-50/50">
                    {tags.length === 0 ? (
                      <span className="text-xs text-slate-400">Belum ada tag.</span>
                    ) : (
                      tags.map((tag) => {
                        const isSelected = selectedTagIds.includes(tag.id_tag);
                        return (
                          <button
                            key={tag.id_tag}
                            type="button"
                            onClick={() => handleTagToggle(tag.id_tag)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                              isSelected
                                ? "bg-primary text-white border-primary"
                                : "bg-white dark:bg-slate-950 text-slate-650 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                            }`}
                          >
                            #{tag.name}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full py-4 font-bold text-sm shadow-md">
                  Simpan Perubahan
                </Button>

              </CardContent>
            </Card>

            {/* Google Search Preview */}
            <Card className="border border-primary/5">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                  <Search size={15} className="text-slate-400" />
                  Google Search Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
                <span className="text-[11px] text-slate-500 font-medium block">
                  https://halaqah-id.vercel.app/blog/{slug || "slug-post"}
                </span>
                <h4 className="text-lg font-bold text-blue-600 hover:underline cursor-pointer leading-tight">
                  {metaTitle || title || "Judul Artikel Default..."}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {metaDesc || excerpt || "Meta description artikel akan terangkum di sini untuk pencarian Google..."}
                </p>
              </CardContent>
            </Card>

            {/* Real-time SEO Score & Auditor */}
            <Card className="border border-primary/5">
              <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                  <Sparkles size={15} className="text-primary" />
                  SEO Audit Panel
                </CardTitle>
                <span className={`px-2 py-0.5 text-xs font-black rounded-lg ${
                  seoAudit.score > 80 ? "bg-emerald-100 text-emerald-800" :
                  seoAudit.score > 50 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                }`}>
                  Score: {seoAudit.score}
                </span>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                
                {/* Target keyword inputs */}
                <div className="space-y-1.5">
                  <Label htmlFor="targetKeyword" className="text-xs">Fokus Kata Kunci (Target Keyword)</Label>
                  <Input
                    id="targetKeyword"
                    value={targetKeyword}
                    onChange={(e) => setTargetKeyword(e.target.value)}
                    placeholder="Contoh: aplikasi tahfidz"
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  {/* Error & Warning Lists */}
                  {seoAudit.warnings.map((warning, idx) => (
                    <div key={idx} className="flex gap-2 items-start text-xs text-amber-600 font-medium">
                      <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                      <span>{warning}</span>
                    </div>
                  ))}

                  {/* Pass List */}
                  {seoAudit.passes.map((pass, idx) => (
                    <div key={idx} className="flex gap-2 items-start text-xs text-emerald-600 font-medium">
                      <CheckCircle size={14} className="shrink-0 mt-0.5" />
                      <span>{pass}</span>
                    </div>
                  ))}
                </div>

              </CardContent>
            </Card>

          </div>

        </form>
      )}

    </div>
  );
}
