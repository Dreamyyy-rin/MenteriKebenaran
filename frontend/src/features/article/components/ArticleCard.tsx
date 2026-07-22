import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import type { NewsArticle } from "@/types/news";

interface ArticleCardProps {
  news: NewsArticle;
  formatDate: (dateString: string) => string;
}

export function ArticleCard({ news, formatDate }: ArticleCardProps) {
  return (
    <Link to={`/news/${news.slug}`}>
      <div className="group bg-card rounded-3xl overflow-hidden border-2 border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
        <div className="aspect-[16/10] w-full overflow-hidden relative">
          <img
            src={news.foto || "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1000"}
            alt={news.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-md text-foreground font-bold shadow-sm rounded-xl px-3 py-1">
              {news.category || "General"}
            </Badge>
          </div>
        </div>

        <div className="p-6 flex flex-col grow">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold mb-3">
            <span>{formatDate(news.createdAt)}</span>
            {news.views !== undefined && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {news.views}
                </span>
              </>
            )}
          </div>

          <h3 className="text-xl font-bold mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {news.title}
          </h3>
          
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed mb-4">
            {news.artikel.replace(/<[^>]*>?/gm, '')}
          </p>

          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
            <span className="font-semibold text-sm text-foreground">{news.author?.fullName || "Admin"}</span>
            <span className="text-xs text-muted-foreground">⏱ {Math.ceil(news.artikel.length / 200)} min read</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
