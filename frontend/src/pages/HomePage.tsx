import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroArticle } from "@/features/article/components/HeroArticle";
import { ArticleCard } from "@/features/article/components/ArticleCard";
import { TrendingSection } from "@/features/article/components/TrendingSection";
import type { NewsArticle, NewsResponse } from "@/types/news";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function HomePage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news?limit=10");
        if (res.ok) {
          const data: NewsResponse = await res.json();
          const items = data.data || data.news || (Array.isArray(data) ? data : []);
          setArticles(items);
        }
      } catch (error) {
        console.error("Gagal mengambil berita dari database:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <p className="text-xl text-muted-foreground animate-pulse">Memuat berita dari database...</p>
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
        {articles.length === 0 ? (
          <div className="py-32 text-center border border-border/50 rounded-[2rem] bg-gradient-to-b from-card/40 to-muted/20 shadow-sm max-w-2xl mx-auto space-y-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📰</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Belum Ada Berita di Database</h2>
            <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
              Portal saat ini masih kosong. Silakan masuk ke Dashboard untuk mulai menulis dan menerbitkan berita pertama Anda!
            </p>
            <div className="pt-2">
              <Link to="/dashboard">
                <Button size="lg" className="rounded-full px-8 font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">Buka Dashboard</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
