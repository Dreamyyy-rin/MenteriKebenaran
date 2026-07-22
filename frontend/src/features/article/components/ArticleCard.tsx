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
      <div className="group flex flex-col gap-3">
        <div className="aspect-[16/10] w-full overflow-hidden bg-muted rounded-xl">
          <img
            src={news.foto || "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1000"}
            alt={news.title}
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-background/90 text-foreground text-xs shadow-none rounded-none px-2 py-0.5">
              {news.category || "General"}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col grow pt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
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

          <h3 className="text-lg font-bold mb-2 line-clamp-2 leading-snug group-hover:underline decoration-primary">
            {news.title}
          </h3>
          
          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed mb-4">
            {news.artikel.replace(/<[^>]*>?/gm, '')}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <span className="font-medium text-sm text-foreground">{news.author?.fullName || "Admin"}</span>
            <span className="text-xs text-muted-foreground">{Math.ceil(news.artikel.length / 200)} min read</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
