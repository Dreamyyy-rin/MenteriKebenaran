import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommentSection } from "@/features/comment/components/CommentSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, User, Eye } from "lucide-react";
import type { NewsArticle } from "@/types/news";

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      if (!slug || fetchedRef.current === slug) return;
      fetchedRef.current = slug;

      try {
        const res = await fetch(`/api/news/slug/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setArticle(data);
        } else {
          setArticle(null);
        }
      } catch (error) {
        console.error("Gagal mengambil detail berita:", error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
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

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center space-y-4 max-w-md">
          <h1 className="text-3xl font-extrabold">Artikel Tidak Ditemukan</h1>
          <p className="text-muted-foreground text-sm">
            Maaf, artikel yang kamu cari tidak ditemukan di database atau telah dihapus.
          </p>
          <div className="pt-2">
            <Link to="/">
              <Button className="rounded-full">Kembali ke Beranda</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 sm:px-8 py-10 space-y-8">
        {/* Tombol Navigasi Kembali */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>

        {/* Header Artikel */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="rounded-full px-3 py-1 font-semibold text-xs">
              {article.category || "General"}
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
            {article.title}
          </h1>

          {/* Meta Info Penulis & Tanggal */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pt-2 border-b pb-6">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                  {article.author?.fullName?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">
                {article.author?.fullName || article.author?.username || "Penulis"}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.createdAt)}</span>
            </div>

            {article.views !== undefined && (
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>{article.views} views</span>
              </div>
            )}
          </div>
        </div>

        {/* Gambar Utama Artikel */}
        {article.foto && (
          <div className="aspect-video w-full rounded-2xl overflow-hidden border shadow-sm">
            <img
              src={article.foto}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Isi Paragraf Artikel */}
        <article className="prose prose-slate dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed text-foreground/95 space-y-6 pt-4">
          {article.artikel.split("\n\n").map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </article>

        {/* Forum Komentar */}
        <div className="pt-10">
          <CommentSection newsId={article._id} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
