import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommentSection } from "@/features/comment/components/CommentSection";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { NewsArticle } from "@/types/news";

// Fallback Mock Data jika berita tidak ditemukan di backend (untuk preview)
const MOCK_DETAIL: NewsArticle = {
  _id: "1",
  title: "Global Markets Rally as Tech Giants Announce Breakthrough AI Models",
  slug: "global-markets-rally-ai-models",
  artikel: `Major technology companies have unveiled their latest artificial intelligence models, causing a significant surge in stock markets worldwide. Investors are optimistic about the productivity gains expected across various sectors.

The new generation of models features advanced reasoning abilities, multi-modal integration, and significantly reduced computational costs. Industry leaders believe this will accelerate deployment across healthcare, finance, and automated manufacturing.

"We are witnessing a pivotal shift in how enterprise software is constructed," said a senior analyst at Global Financial Intelligence. "The speed at which these models are being integrated into core business operations is unprecedented."

However, policymakers and ethics boards have renewed calls for stringent regulation, emphasizing the need for transparent safety audits and data provenance verification.`,
  category: "Tech",
  foto: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000",
  author: { _id: "a1", fullName: "John Doe", username: "johndoe" },
  createdAt: "2026-07-20T10:00:00Z",
  updatedAt: "2026-07-20T10:00:00Z",
};

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      if (!slug) return;
      try {
        const res = await fetch(`http://localhost:5000/api/news/slug/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setArticle(data);
        } else {
          setArticle({ ...MOCK_DETAIL, slug });
        }
      } catch (error) {
        console.error("Gagal mengambil detail berita:", error);
        setArticle({ ...MOCK_DETAIL, slug });
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-xl text-muted-foreground animate-pulse">Memuat artikel...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center space-y-4">
          <h1 className="text-3xl font-bold">Artikel Tidak Ditemukan</h1>
          <p className="text-muted-foreground">Maaf, artikel yang kamu cari tidak ada atau telah dihapus.</p>
          <Link to="/">
            <Button className="rounded-full">Kembali ke Beranda</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 sm:px-8 py-10 space-y-10">
        {/* Navigation Back */}
        <div>
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
            ← Kembali ke Beranda
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-6">
          {article.category && (
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
              {article.category}
            </span>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 pt-2">
            <Avatar className="h-11 w-11 border">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {article.author?.fullName?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-foreground leading-none">
                {article.author?.fullName || "Admin"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Dipublikasikan pada {formatDate(article.createdAt)} • {Math.ceil(article.artikel.length / 200)} min read
              </p>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl border shadow-sm">
          <img
            src={article.foto || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000"}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Content */}
        <article className="prose dark:prose-invert max-w-none text-foreground/90 leading-relaxed space-y-6 text-lg font-normal">
          {article.artikel.split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </article>

        {/* FORUM DISKUSI KOMENTAR */}
        <CommentSection newsId={article._id} />
      </main>

      <Footer />
    </div>
  );
}
