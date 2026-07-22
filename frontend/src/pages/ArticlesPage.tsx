import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/features/article/components/ArticleCard";
import { Input } from "@/components/ui/input";
import type { NewsArticle, NewsResponse } from "@/types/news";

export default function ArticlesPage() {
  const [articlesList, setArticlesList] = useState<NewsArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const queryUrl = searchTerm.trim()
          ? `/api/news?category=Artikel&search=${encodeURIComponent(searchTerm)}&limit=12`
          : `/api/news?category=Artikel&limit=12`;

        const res = await fetch(queryUrl);
        if (res.ok) {
          const data: NewsResponse = await res.json();
          const items = data.data || data.news || (Array.isArray(data) ? data : []);
          setArticlesList(items);
        } else {
          setArticlesList([]);
        }
      } catch (error) {
        console.error("Gagal memuat artikel dari database:", error);
        setArticlesList([]);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchArticles();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10 space-y-10">
        <div className="border-b pb-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Kumpulan Artikel
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Opini mendalam, tulisan edukasi, ulasan teknologi, dan sudut pandang dari database MenteriKebenaran.
            </p>
          </div>

          <div className="relative w-full max-w-3xl mt-4">
            <Input
              type="text"
              placeholder="Cari artikel berdasarkan judul atau kata kunci..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 w-full rounded-2xl bg-muted/40 pl-6 pr-14 text-base focus-visible:ring-2 focus-visible:ring-primary/20 border-border/50 shadow-sm transition-all focus-visible:bg-background"
            />
            <span className="absolute right-5 top-4 text-xl opacity-60">
              🔍
            </span>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-muted-foreground animate-pulse">
            Memuat daftar artikel dari database...
          </div>
        ) : articlesList.length === 0 ? (
          <div className="py-24 text-center space-y-4 border border-border/40 rounded-[2rem] bg-gradient-to-b from-card/30 to-muted/10 shadow-sm max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-3xl opacity-50">📭</span>
            </div>
            <p className="text-2xl font-bold text-foreground">Artikel Tidak Ditemukan</p>
            <p className="text-base text-muted-foreground max-w-md mx-auto">
              {searchTerm.trim()
                ? `Tidak ada artikel yang cocok dengan kata kunci "${searchTerm}". Coba gunakan kata kunci lain.`
                : "Belum ada postingan artikel di database saat ini."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articlesList.map((item) => (
              <ArticleCard key={item._id} news={item} formatDate={formatDate} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
