import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/features/article/components/ArticleCard";
import { Input } from "@/components/ui/input";
import type { NewsArticle, NewsResponse } from "@/types/news";

const MOCK_ARTICLES_PAGE: NewsArticle[] = [
  {
    _id: "a1",
    title: "Global Markets Rally as Tech Giants Announce Breakthrough AI Models",
    slug: "global-markets-rally-ai-models",
    artikel: "Major technology companies have unveiled their latest artificial intelligence models, causing a significant surge in stock markets worldwide. Analysts analyze the long-term economic impacts.",
    category: "Artikel",
    foto: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000",
    author: { _id: "u1", fullName: "John Doe", username: "johndoe" },
    createdAt: "2026-07-20T10:00:00Z",
    updatedAt: "2026-07-20T10:00:00Z",
  },
  {
    _id: "a2",
    title: "Startup 'EcoDrive' Raises $50M to Revolutionize EV Charging",
    slug: "startup-ecodrive-raises-50m-ev-charging",
    artikel: "EcoDrive, a prominent EV infrastructure startup, has closed a successful funding round. An in-depth look into their technology stack and market strategy.",
    category: "Artikel",
    foto: "https://images.unsplash.com/photo-1558441719-6705166e2375?q=80&w=1000",
    author: { _id: "u2", fullName: "Jane Smith", username: "janesmith" },
    createdAt: "2026-07-17T16:20:00Z",
    updatedAt: "2026-07-17T16:20:00Z",
  },
  {
    _id: "a3",
    title: "New Advances in Quantum Computing Announced at Global Summit",
    slug: "quantum-computing-advances-global-summit",
    artikel: "Researchers have unveiled breakthroughs in quantum error correction. Read our comprehensive analysis on how quantum computing will change cybersecurity forever.",
    category: "Artikel",
    foto: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000",
    author: { _id: "u3", fullName: "Alex Smith", username: "alexsmith" },
    createdAt: "2026-07-15T11:45:00Z",
    updatedAt: "2026-07-15T11:45:00Z",
  }
];

export default function ArticlesPage() {
  const [articlesList, setArticlesList] = useState<NewsArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const queryUrl = searchTerm.trim()
          ? `http://localhost:5000/api/news?category=Artikel&search=${encodeURIComponent(searchTerm)}&limit=12`
          : `http://localhost:5000/api/news?category=Artikel&limit=12`;

        const res = await fetch(queryUrl);
        if (res.ok) {
          const data: NewsResponse = await res.json();
          if (data.news && Array.isArray(data.news) && data.news.length > 0) {
            setArticlesList(data.news);
          } else {
            const filteredMock = MOCK_ARTICLES_PAGE.filter(a =>
              a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              a.artikel.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setArticlesList(filteredMock);
          }
        } else {
          setArticlesList(MOCK_ARTICLES_PAGE);
        }
      } catch (error) {
        console.error("Gagal memuat artikel:", error);
        setArticlesList(MOCK_ARTICLES_PAGE);
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
              Opini mendalam, tulisan edukasi, ulasan teknologi, dan sudut pandang dari berbagai penulis.
            </p>
          </div>

          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Cari artikel berdasarkan judul atau kata kunci..."
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
            Memuat daftar artikel...
          </div>
        ) : articlesList.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <p className="text-lg font-semibold text-foreground">Artikel Tidak Ditemukan</p>
            <p className="text-sm text-muted-foreground">
              Tidak ada artikel yang cocok dengan kata kunci &quot;{searchTerm}&quot;.
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
