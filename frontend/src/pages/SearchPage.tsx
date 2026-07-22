import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/features/article/components/ArticleCard";
import type { NewsArticle, NewsResponse } from "@/types/news";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function performSearch() {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/news?search=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data: NewsResponse = await res.json();
          const items = data.data || data.news || (Array.isArray(data) ? data : []);
          setResults(items);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Gagal melakukan pencarian:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    performSearch();
  }, [query]);

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
        <div className="border-b pb-6 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Hasil Pencarian 🔍
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {query ? (
              <>Menampilkan hasil pencarian untuk kata kunci <span className="font-semibold text-foreground">&quot;{query}&quot;</span></>
            ) : (
              "Ketikkan kata kunci di kolom pencarian di atas untuk mencari berita."
            )}
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-muted-foreground animate-pulse">
            Mencari berita...
          </div>
        ) : !query.trim() ? (
          <div className="py-20 text-center text-muted-foreground">
            Silakan masukkan kata kunci pencarian pada Navbar di atas.
          </div>
        ) : results.length === 0 ? (
          <div className="py-24 text-center space-y-4 border border-border/40 rounded-[2rem] bg-gradient-to-b from-card/30 to-muted/10 shadow-sm max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-3xl opacity-50">📭</span>
            </div>
            <p className="text-2xl font-bold text-foreground">Tidak Ada Hasil</p>
            <p className="text-base text-muted-foreground max-w-md mx-auto">
              Tidak ditemukan berita yang cocok dengan kata kunci <span className="font-semibold text-foreground">&quot;{query}&quot;</span>. Cobalah kata kunci yang lain!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((item) => (
              <ArticleCard key={item._id} news={item} formatDate={formatDate} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
