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
            <section className="relative py-20 sm:py-28 mb-8 flex flex-col items-center justify-center text-center overflow-hidden rounded-[3rem] bg-gradient-to-br from-primary/10 via-background to-blue-500/10 border-2 border-primary/10 shadow-lg">
              <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/donpm3auk/image/upload/v1784655297/Mobile_login_vmrppk.gif')] opacity-[0.03] bg-cover bg-center mix-blend-overlay"></div>
              
              <div className="relative z-10 space-y-6 max-w-3xl px-6">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-balance leading-none">
                  Dunia Berita, <br />
                  <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">Gaya Baru.</span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-semibold leading-relaxed">
                  Selamat datang di MenteriKebenaran. Temukan sudut pandang segar, cerita inspiratif, dan artikel yang bikin kamu semangat tiap hari! ✨
                </p>
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/news">
                    <Button size="lg" className="rounded-full h-14 px-8 text-lg font-bold shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 bg-primary">
                      Mulai Membaca 🚀
                    </Button>
                  </Link>
                  <Link to="/articles">
                    <Button variant="outline" size="lg" className="rounded-full h-14 px-8 text-lg font-bold border-2 hover:bg-muted/50 hover:-translate-y-1 transition-all duration-300">
                      Jelajahi Artikel
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {heroArticle && (
              <HeroArticle article={heroArticle} formatDate={formatDate} />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
                  <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                    <span className="text-4xl">🔥</span> Berita Terbaru
                  </h2>
                  <Link to="/news">
                    <Button variant="ghost" className="rounded-full text-primary font-bold hover:bg-primary/10">
                      Lihat Semua Berita &rarr;
                    </Button>
                  </Link>
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
