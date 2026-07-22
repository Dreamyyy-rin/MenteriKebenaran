import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/features/article/components/ArticleCard";
import { Input } from "@/components/ui/input";
import type { NewsArticle, NewsResponse } from "@/types/news";

const MOCK_NEWS_PAGE: NewsArticle[] = [
  {
    _id: "n1",
    title: "Central Bank Keeps Interest Rates Steady Amid Inflation Concerns",
    slug: "central-bank-keeps-interest-rates-steady",
    artikel: "The central bank has decided to hold interest rates at their current level, citing ongoing concerns about persistent inflation and market volatility worldwide.",
    category: "Berita",
    foto: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1000",
    author: { _id: "a2", fullName: "Jane Smith", username: "janesmith" },
    createdAt: "2026-07-19T14:30:00Z",
    updatedAt: "2026-07-19T14:30:00Z",
  },
  {
    _id: "n2",
    title: "National Election Results: Incumbent Party Secures Narrow Victory",
    slug: "national-election-results-incumbent-victory",
    artikel: "After a closely fought campaign, the incumbent party has managed to retain a narrow majority in parliament, promising political continuity and economic reform.",
    category: "Berita",
    foto: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=1000",
    author: { _id: "a3", fullName: "John Doe", username: "johndoe" },
    createdAt: "2026-07-18T09:15:00Z",
    updatedAt: "2026-07-18T09:15:00Z",
  },
  {
    _id: "n3",
    title: "Championship Finals: Underdogs Claim Historic Victory",
    slug: "championship-finals-underdog-victory",
    artikel: "In an unprecedented turn of events, the underdog team claimed the championship title with a sudden-death winning goal in overtime, shocking fans nationwide.",
    category: "Berita",
    foto: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000",
    author: { _id: "a3", fullName: "John Doe", username: "johndoe" },
    createdAt: "2026-07-16T20:00:00Z",
    updatedAt: "2026-07-16T20:00:00Z",
  },
  {
    _id: "n4",
    title: "Renewable Energy Capacity Reaches Record High Global Shares",
    slug: "renewable-energy-record-high-capacity",
    artikel: "Solar and wind energy installations have surpassed all previous benchmarks this quarter, significantly reducing grid carbon intensity across major industrial hubs.",
    category: "Berita",
    foto: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1000",
    author: { _id: "a1", fullName: "John Doe", username: "johndoe" },
    createdAt: "2026-07-14T08:00:00Z",
    updatedAt: "2026-07-14T08:00:00Z",
  }
];

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
          if (data.news && Array.isArray(data.news) && data.news.length > 0) {
            setNewsList(data.news);
          } else {
            const filteredMock = MOCK_NEWS_PAGE.filter(n => 
              n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              n.artikel.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setNewsList(filteredMock);
          }
        } else {
          setNewsList(MOCK_NEWS_PAGE);
        }
      } catch (error) {
        console.error("Gagal memuat berita:", error);
        setNewsList(MOCK_NEWS_PAGE);
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
              Kumpulan berita terkini, peristiwa nasional, dan informasi tepercaya dari MenteriKebenaran.
            </p>
          </div>

          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Cari berita berdasarkan judul atau isi kata kunci..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 w-full rounded-xl bg-muted/30 pl-4 pr-12 text-base focus-visible:ring-1 border"
            />
            <span className="absolute right-4 top-3.5 text-base text-muted-foreground">
              🔍
            </span>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-muted-foreground animate-pulse">
            Memuat daftar berita...
          </div>
        ) : newsList.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <p className="text-lg font-semibold text-foreground">Berita Tidak Ditemukan</p>
            <p className="text-sm text-muted-foreground">
              Tidak ada berita yang cocok dengan kata kunci &quot;{searchTerm}&quot;.
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
