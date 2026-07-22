import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroArticle } from "@/features/article/components/HeroArticle";
import { ArticleCard } from "@/features/article/components/ArticleCard";

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10 space-y-16">
        {articles.length === 0 ? (
          <div className="py-24 text-center space-y-4 border-2 border-border/40 rounded-[3rem] bg-gradient-to-b from-card/30 to-muted/10 shadow-sm max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl opacity-80 hover:scale-125 transition-transform cursor-pointer">🗞️</span>
            </div>
            <p className="text-3xl font-extrabold text-foreground">Belum Ada Berita</p>
            <p className="text-lg text-muted-foreground font-medium max-w-md mx-auto">
              Saat ini belum ada artikel yang dipublikasikan. Coba mampir lagi nanti ya!
            </p>
          </div>
        ) : (
          <>
            <section className="relative py-16 mb-8 flex flex-col items-start justify-center overflow-hidden rounded-2xl bg-muted/30 border border-border/50">
              <div className="relative z-10 space-y-6 max-w-3xl px-8 sm:px-12">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
                  Kabar Terbaru, <br />
                  <span className="text-primary">Kapan Saja.</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl font-medium leading-relaxed">
                  Temukan berita terkini, analisis mendalam, dan berbagai perspektif terpercaya setiap harinya.
                </p>
                <div className="pt-6 flex flex-col sm:flex-row items-center gap-4">
                  <Link to="/news">
                    <Button size="lg" className="rounded-xl px-8 font-semibold shadow-sm">
                      Mulai Membaca
                    </Button>
                  </Link>
                  <Link to="/articles">
                    <Button variant="outline" size="lg" className="rounded-xl px-8 font-semibold">
                      Jelajahi Artikel
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {heroArticle && (
              <HeroArticle article={heroArticle} formatDate={formatDate} />
            )}

            <div className="pt-8">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                  <h2 className="text-2xl font-bold tracking-tight">
                    Berita Terbaru
                  </h2>
                  <Link to="/news">
                    <Button variant="ghost" className="text-primary font-medium hover:bg-primary/10">
                      Lihat Semua &rarr;
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {latestNews.map((news) => (
                    <ArticleCard key={news._id} news={news} formatDate={formatDate} />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
