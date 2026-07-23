import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  LayoutDashboard,
  FileText,
  SquarePen,
  Globe,
  ArrowLeft,
  Eye,
  Newspaper,
  FileSpreadsheet,
  Trash2,
  Plus,
  TrendingUp,
  Upload,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArticleCard } from "@/features/article/components/ArticleCard";
import { toast } from "@/components/ui/toast";
import type { NewsArticle, NewsResponse } from "@/types/news";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "my-articles" | "all-articles" | "write-article">("overview");

  // Auth User & Token
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ _id?: string; fullName: string; email: string; username?: string; role: string } | null>(null);

  // Data State
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State untuk Write/Edit Article
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formSummary, setFormSummary] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCategory, setFormCategory] = useState<"Berita" | "Artikel">("Berita");
  const [formFoto, setFormFoto] = useState("");
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [isUploading, setIsUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken || !storedUser) {
      toast.error("Akses Ditolak", "Silakan login terlebih dahulu untuk mengakses Dashboard.");
      navigate("/login");
      return;
    }

    setToken(storedToken);
    try {
      setCurrentUser(JSON.parse(storedUser));
    } catch (e) {
      console.error(e);
    }
  }, [navigate]);

  // Fetch semua berita dari backend
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/news?limit=100");
      if (res.ok) {
        const data: NewsResponse = await res.json();
        const items = data.data || data.news || (Array.isArray(data) ? data : []);
        setArticles(items);
      }
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const isAdmin = currentUser?.role?.toLowerCase() === "admin";

  // Filter artikel buatan user saat ini
  const myArticles = articles.filter(
    (a) =>
      a.author?._id === currentUser?._id ||
      a.author?.username === currentUser?.username ||
      a.author?.fullName === currentUser?.fullName
  );

  // Statistik Real dari Database Backend (Personalized for User / Platform for Admin)
  const targetArticles = isAdmin ? articles : myArticles;
  const totalViews = targetArticles.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const publishedCount = targetArticles.length;
  const totalBerita = targetArticles.filter((a) => a.category === "Berita").length;
  const totalArtikel = targetArticles.filter((a) => a.category === "Artikel").length;
  const avgViews = publishedCount > 0 ? Math.round(totalViews / publishedCount) : 0;
  const topArticles = targetArticles.slice().sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);

  // Submit Handler (Create atau Update News)
  async function handleSubmitArticle(e: React.FormEvent) {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      toast.warning("Form Belum Lengkap", "Judul dan Isi Artikel wajib diisi!");
      return;
    }

    if (!token) return;

    setSubmitting(true);
    try {
      const fullText = formSummary ? `${formSummary}\n\n${formContent}` : formContent;
      const payload = {
        title: formTitle,
        artikel: fullText,
        category: formCategory,
        foto: formFoto || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000",
      };

      const url = editingId
        ? `http://localhost:5000/api/news/${editingId}`
        : "http://localhost:5000/api/news";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          editingId ? "Berhasil Memperbarui!" : "Berhasil Menerbitkan!",
          editingId ? "Artikel berhasil diperbarui di database." : "Artikel baru telah diterbitkan."
        );
        resetForm();
        await fetchArticles();
        setActiveTab("my-articles");
      } else {
        toast.error("Gagal Menyimpan", data.error || "Terjadi kesalahan saat menyimpan artikel.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi Kesalahan Jaringan", "Gagal terhubung ke server database.");
    } finally {
      setSubmitting(false);
    }
  }

  // Hapus Berita
  async function handleDeleteArticle(id: string) {
    if (!token) return;

    toast.confirm({
      title: "Hapus Artikel?",
      message: "Apakah Anda yakin ingin menghapus postingan ini? Tindakan ini tidak dapat dibatalkan.",
      variant: "destructive",
      confirmText: "Hapus Postingan",
      cancelText: "Batal",
      onConfirm: async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/news/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.ok) {
            toast.success("Berhasil Dihapus", "Artikel telah dihapus dari database.");
            await fetchArticles();
          } else {
            const data = await res.json();
            toast.error("Gagal Menghapus", data.error || "Akses ditolak.");
          }
        } catch (error) {
          console.error(error);
          toast.error("Error", "Gagal menghapus berita.");
        }
      },
    });
  }

  // Edit Berita
  function handleStartEdit(article: NewsArticle) {
    setEditingId(article._id);
    setFormTitle(article.title);
    setFormContent(article.artikel);
    setFormCategory((article.category as "Berita" | "Artikel") || "Berita");
    setFormFoto(article.foto || "");
    setActiveTab("write-article");
  }

  function resetForm() {
    setEditingId(null);
    setFormTitle("");
    setFormSummary("");
    setFormContent("");
    setFormCategory("Berita");
    setFormFoto("");
    setImageMode("url");
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setIsUploading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengunggah gambar");
      }

      setFormFoto(data.url);
      toast.success("Berhasil", "Gambar berhasil diunggah");
    } catch (error: any) {
      toast.error("Gagal", error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* 1. SIDEBAR KIRI */}
      <aside className="w-64 border-r bg-card/50 p-6 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="space-y-8">
          {/* Header Brand */}
          <div className="space-y-1">
            <h2 className="font-extrabold text-xl tracking-tight text-foreground">
              Author Dashboard
            </h2>
            <p className="text-xs text-muted-foreground">
              {currentUser?.fullName} ({currentUser?.role})
            </p>
          </div>

          {/* Menu Navigasi Utama */}
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </button>

            <button
              onClick={() => setActiveTab("my-articles")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "my-articles"
                  ? "bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <FileText className="w-4 h-4" />
              My Articles ({myArticles.length})
            </button>

            <button
              onClick={() => {
                resetForm();
                setActiveTab("write-article");
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "write-article"
                  ? "bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <SquarePen className="w-4 h-4" />
              {editingId ? "Edit Article" : "Write Article"}
            </button>
          </div>

          {/* Menu Khusus Admin */}
          {isAdmin && (
            <div className="space-y-2 pt-4 border-t border-border/40">
              <p className="px-3.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                ADMIN MANAGEMENT
              </p>
              <button
                onClick={() => setActiveTab("all-articles")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "all-articles"
                    ? "bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Globe className="w-4 h-4" />
                All Articles ({articles.length})
              </button>
            </div>
          )}
        </div>

        {/* Tombol Back to Portal */}
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="w-full rounded-xl justify-center text-xs font-semibold gap-2 border-border/60"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Portal
        </Button>
      </aside>

      {/* 2. KONTEN UTAMA DASHBOARD */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto overflow-y-auto">
        {/* TAB OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-10">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Overview</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {isAdmin
                  ? "Ringkasan statistik platform dan seluruh publikasi berita."
                  : "Ringkasan statistik performa artikel publikasi Anda."}
              </p>
            </div>

            {/* 4 Kartu Statistik Backend (Personalized) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl border bg-card/60 space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-medium">Total Views</span>
                  <Eye className="w-4 h-4" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">{totalViews.toLocaleString()}</span>
                  <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> {avgViews} /post
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl border bg-card/60 space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-medium">Articles Published</span>
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">{publishedCount}</span>
                  <span className="text-xs font-medium text-emerald-600">{publishedCount} terbit</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl border bg-card/60 space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-medium">Kategori Berita</span>
                  <Newspaper className="w-4 h-4" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">{totalBerita}</span>
                  <span className="text-xs font-medium text-muted-foreground">Postings</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl border bg-card/60 space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-medium">Kategori Artikel</span>
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">{totalArtikel}</span>
                  <span className="text-xs font-medium text-muted-foreground">Postings</span>
                </div>
              </div>
            </div>

            {/* Top Performing Articles */}
            <div className="space-y-6 pt-4">
              <h2 className="text-xl font-bold">Top Performing Articles</h2>
              {loading ? (
                <p className="text-sm text-muted-foreground animate-pulse">Memuat berita...</p>
              ) : topArticles.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada artikel yang diterbitkan.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {topArticles.map((item) => (
                    <ArticleCard key={item._id} news={item} formatDate={formatDate} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB MY ARTICLES */}
        {activeTab === "my-articles" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">My Articles</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Manage your published news and articles.
                </p>
              </div>
              <Button
                onClick={() => {
                  resetForm();
                  setActiveTab("write-article");
                }}
                className="rounded-full gap-2 text-xs font-semibold px-4 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Write New Article
              </Button>
            </div>

            {myArticles.length === 0 ? (
              <div className="py-20 text-center border rounded-2xl bg-card/30 space-y-3">
                <p className="text-lg font-bold">Belum Ada Artikel</p>
                <p className="text-sm text-muted-foreground">
                  Kamu belum pernah menerbitkan artikel. Tekan tombol di atas untuk membuat artikel pertamamu!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {myArticles.map((item) => (
                  <div key={item._id} className="space-y-3 border rounded-2xl p-4 bg-card/40">
                    <ArticleCard news={item} formatDate={formatDate} />
                    <div className="pt-3 border-t flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartEdit(item)}
                        className="h-8 text-xs rounded-lg gap-1.5 cursor-pointer"
                      >
                        <SquarePen className="w-3.5 h-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteArticle(item._id)}
                        className="h-8 text-xs rounded-lg gap-1.5 text-destructive hover:bg-destructive/10 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB ALL ARTICLES (ADMIN ONLY) */}
        {activeTab === "all-articles" && isAdmin && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">All Articles (Admin Management)</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Kelola seluruh artikel platform dari semua penulis.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((item) => (
                <div key={item._id} className="space-y-3 border rounded-2xl p-4 bg-card/40">
                  <ArticleCard news={item} formatDate={formatDate} />
                  <div className="pt-3 border-t flex justify-between items-center">
                    <span className="text-xs text-muted-foreground font-medium">
                      Author: {item.author?.fullName || "Admin"}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteArticle(item._id)}
                      className="h-8 text-xs rounded-lg gap-1.5 text-destructive hover:bg-destructive/10 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Hapus
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB WRITE / EDIT ARTICLE */}
        {activeTab === "write-article" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                  {editingId ? "Edit Article" : "Write Article"}
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Create or edit a compelling story for Minister of Truth.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => setActiveTab("my-articles")} className="rounded-full">
                  Cancel
                </Button>
                <Button onClick={handleSubmitArticle} disabled={submitting} className="rounded-full px-5">
                  {submitting ? "Saving..." : editingId ? "Update Article" : "Publish Article"}
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmitArticle} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Content */}
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Headline Title</label>
                  <Input
                    type="text"
                    placeholder="e.g. The Future of Technology & Innovation"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="h-12 rounded-xl bg-muted/30 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Excerpt / Summary</label>
                  <textarea
                    rows={3}
                    placeholder="A brief summary of the article..."
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    className="w-full rounded-xl border border-input bg-muted/30 p-3 text-sm focus-visible:outline-none focus-visible:ring-1"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Article Content</label>
                  <textarea
                    rows={12}
                    placeholder="Write your article content here..."
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    className="w-full rounded-xl border border-input bg-muted/30 p-4 text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-1"
                  />
                </div>
              </div>

              {/* Right Column: Publish Settings */}
              <div className="space-y-6">
                <div className="border rounded-2xl p-6 bg-card/60 space-y-6">
                  <h3 className="font-bold text-base border-b pb-3">Publish Settings</h3>

                  {/* KATEGORI: HANYA BERITA ATAU ARTIKEL */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as "Berita" | "Artikel")}
                      className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1"
                    >
                      <option value="Berita">Berita</option>
                      <option value="Artikel">Artikel</option>
                    </select>
                  </div>

                  {/* COVER IMAGE */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Cover Image
                      </label>
                      <div className="flex items-center bg-muted p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => setImageMode("url")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                            imageMode === "url" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <LinkIcon className="w-3.5 h-3.5" /> URL
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageMode("upload")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                            imageMode === "upload" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5" /> Upload
                        </button>
                      </div>
                    </div>

                    {imageMode === "url" ? (
                      <Input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={formFoto}
                        onChange={(e) => setFormFoto(e.target.value)}
                        className="h-10 rounded-xl text-xs"
                      />
                    ) : (
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                          className="h-10 rounded-xl text-xs file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                        />
                        {isUploading && <span className="text-xs text-muted-foreground animate-pulse">Mengunggah...</span>}
                      </div>
                    )}
                    
                    {formFoto && (
                      <div className="aspect-video w-full rounded-xl overflow-hidden border mt-2">
                        <img src={formFoto} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
