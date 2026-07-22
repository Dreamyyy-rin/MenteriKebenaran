import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/features/article/components/ArticleCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { NewsArticle, NewsResponse } from "@/types/news";

export default function NewsPage() {
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const queryUrl = searchTerm.trim()
          ? `http://localhost:5000/api/news?category=Berita&search=${encodeURIComponent(searchTerm)}&limit=12`
          : `http://localhost:5000/api/news?category=Berita&limit=12`;

        const res = await fetch(queryUrl);
        if (res.ok) {
          const data: NewsResponse = await res.json();
          const items = data.data || data.news || (Array.isArray(data) ? data : []);
          setNewsList(items);
        } else {
          setNewsList([]);
        }
      } catch (error) {
        console.error("Gagal memuat berita dari database:", error);
        setNewsList([]);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchNews();
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
              Indeks Berita
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Kumpulan berita terkini dan informasi tepercaya dari database MenteriKebenaran.
            </p>
          </div>

          <div className="relative w-full">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Cari berita berdasarkan judul atau kata kunci..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 w-full rounded-xl bg-muted/30 pl-11 pr-4 text-base focus-visible:ring-1 border"
            />
          </div>
        </div>


        {loading ? (
          <div className="py-20 text-center text-muted-foreground animate-pulse">
            Memuat daftar berita dari database...
          </div>
        ) : newsList.length === 0 ? (
          <div className="py-20 text-center space-y-2 border rounded-2xl bg-card/30">
            <p className="text-lg font-semibold text-foreground">Berita Tidak Ditemukan</p>
            <p className="text-sm text-muted-foreground">
              {searchTerm.trim()
                ? `Tidak ada berita yang cocok dengan kata kunci "${searchTerm}".`
                : "Belum ada postingan berita di database."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsList.map((item) => (
              <ArticleCard key={item._id} news={item} formatDate={formatDate} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
