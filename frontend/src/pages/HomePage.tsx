import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroArticle } from "@/features/article/components/HeroArticle";
import { ArticleCard } from "@/features/article/components/ArticleCard";
import { TrendingSection } from "@/features/article/components/TrendingSection";
import type { NewsArticle, NewsResponse } from "@/types/news";

const USE_MOCK_DATA = true;

const MOCK_NEWS: NewsArticle[] = [
  {
    _id: "1",
    title: "Global Markets Rally as Tech Giants Announce Breakthrough AI Models",
    slug: "global-markets-rally-ai-models",
    artikel: "Major technology companies have unveiled their latest artificial intelligence models, causing a significant surge in stock markets worldwide. Investors are optimistic about the productivity gains expected across various sectors.",
    category: "Tech",
    foto: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000",
    author: { _id: "a1", fullName: "John Doe", username: "johndoe" },
    createdAt: "2026-07-20T10:00:00Z",
    updatedAt: "2026-07-20T10:00:00Z",
  },
  {
    _id: "2",
    title: "Central Bank Keeps Interest Rates Steady Amid Inflation Concerns",
    slug: "central-bank-keeps-interest-rates-steady",
    artikel: "The central bank has decided to hold interest rates at their current level, citing ongoing concerns about persistent inflation and market volatility.",
    category: "Economy",
    foto: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1000",
    author: { _id: "a2", fullName: "Jane Smith", username: "janesmith" },
    createdAt: "2026-07-19T14:30:00Z",
    updatedAt: "2026-07-19T14:30:00Z",
  },
  {
    _id: "3",
    title: "National Election Results: Incumbent Party Secures Narrow Victory",
    slug: "national-election-results-incumbent-victory",
    artikel: "After a closely fought campaign, the incumbent party has managed to retain a narrow majority in parliament, promising political continuity.",
    category: "National",
    foto: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=1000",
    author: { _id: "a3", fullName: "John Doe", username: "johndoe" },
    createdAt: "2026-07-18T09:15:00Z",
    updatedAt: "2026-07-18T09:15:00Z",
  },
  {
    _id: "4",
    title: "Startup 'EcoDrive' Raises $50M to Revolutionize EV Charging",
    slug: "startup-ecodrive-raises-50m-ev-charging",
    artikel: "EcoDrive, a prominent EV infrastructure startup, has closed a successful funding round, aiming to deploy ultra-fast charging networks globally.",
    category: "Business",
    foto: "https://images.unsplash.com/photo-1558441719-6705166e2375?q=80&w=1000",
    author: { _id: "a1", fullName: "Jane Smith", username: "janesmith" },
    createdAt: "2026-07-17T16:20:00Z",
    updatedAt: "2026-07-17T16:20:00Z",
  },
  {
    _id: "5",
    title: "Championship Finals: Underdogs Claim Historic Victory",
    slug: "championship-finals-underdog-victory",
    artikel: "In an unprecedented turn of events, the underdog team claimed the championship title with a sudden-death winning goal in overtime.",
    category: "Sport",
    foto: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000",
    author: { _id: "a3", fullName: "John Doe", username: "johndoe" },
    createdAt: "2026-07-16T20:00:00Z",
    updatedAt: "2026-07-16T20:00:00Z",
  },
  {
    _id: "6",
    title: "New Advances in Quantum Computing Announced at Global Summit",
    slug: "quantum-computing-advances-global-summit",
    artikel: "Researchers have unveiled breakthroughs in quantum error correction, bringing practical quantum computers one step closer to reality.",
    category: "Tech",
    foto: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000",
    author: { _id: "a2", fullName: "Alex Smith", username: "alexsmith" },
    createdAt: "2026-07-15T11:45:00Z",
    updatedAt: "2026-07-15T11:45:00Z",
  },
];

export default function HomePage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      if (USE_MOCK_DATA) {
        setArticles(MOCK_NEWS);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/news?limit=10");
        const data: NewsResponse = await res.json();
        
        if (data.news && Array.isArray(data.news) && data.news.length > 0) {
          setArticles(data.news);
        } else {
          setArticles(MOCK_NEWS);
        }
      } catch (error) {
        console.error("Gagal mengambil berita:", error);
        setArticles(MOCK_NEWS);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-xl text-muted-foreground animate-pulse">Loading news...</p>
      </div>
    );
  }

  const heroArticle = articles[0];
  const latestNews = articles.slice(1, 5);
  const trendingNews = articles.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10 space-y-16">
        {heroArticle && (
          <HeroArticle article={heroArticle} formatDate={formatDate} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              <h2 className="text-2xl font-bold">Latest News</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {latestNews.map((news) => (
                <ArticleCard key={news._id} news={news} formatDate={formatDate} />
              ))}
            </div>
          </div>

          <TrendingSection articles={trendingNews} formatDate={formatDate} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
