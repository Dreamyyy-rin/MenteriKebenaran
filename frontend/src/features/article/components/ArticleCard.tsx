import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import type { NewsArticle } from "@/types/news";

interface ArticleCardProps {
  news: NewsArticle;
  formatDate: (dateString: string) => string;
}

export function ArticleCard({ news, formatDate }: ArticleCardProps) {
  return (
    <Link to={`/news/${news.slug}`} className="group block transition-all duration-300 hover:-translate-y-1">
      <div className="space-y-4">
        <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl relative shadow-sm group-hover:shadow-md transition-shadow">
          {news.category && (
            <Badge className="absolute top-3 left-3 z-10 font-semibold bg-slate-900/90 text-white hover:bg-slate-900 border-none rounded-md px-2.5 py-1 text-xs shadow-sm">
              {news.category}
            </Badge>
          )}
          <img
            src={news.foto || "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1000"}
            alt={news.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="space-y-2 pt-4">
          <h3 className="font-bold text-xl leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {news.title}
          </h3>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed font-normal">
            {news.artikel.replace(/<[^>]*>?/gm, '')}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
            <span className="font-semibold text-foreground">{news.author?.fullName || "Admin"}</span>
            <span>•</span>
            <span>{formatDate(news.createdAt)}</span>
            <span>•</span>
            <span>⏱ {Math.ceil(news.artikel.length / 200)} min read</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
