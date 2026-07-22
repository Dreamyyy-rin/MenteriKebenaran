import { Link } from "react-router";
import { Separator } from "@/components/ui/separator";
import type { NewsArticle } from "@/types/news";

interface TrendingSectionProps {
  articles: NewsArticle[];
  formatDate: (dateString: string) => string;
}

export function TrendingSection({ articles, formatDate }: TrendingSectionProps) {
  return (
    <aside className="space-y-6 sticky top-24 self-start">
      <div className="space-y-6 bg-muted/30 p-6 rounded-[2.5rem] border-2 border-border/50">
        <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <span className="text-3xl">📈</span> Sedang Tren
        </h2>

        <div className="space-y-6">
          {articles.map((news, index) => (
            <div key={news._id}>
              <Link to={`/news/${news.slug}`} className="group flex gap-4 transition-all duration-300 hover:bg-card hover:shadow-md p-3 rounded-2xl -mx-3">
                <div className="shrink-0 font-black text-4xl text-muted-foreground/30 italic group-hover:text-primary/30 transition-colors">
                  {(index + 1).toString().padStart(2, "0")}
                </div>
                <div className="flex-1 space-y-1">
                  {news.category && (
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider">{news.category}</p>
                  )}
                  <h4 className="font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {news.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    <span className="font-medium">{news.author?.fullName || "Admin"}</span>
                    <span>•</span>
                    <span>{formatDate(news.createdAt)}</span>
                  </div>
                </div>
                <div className="w-16 h-16 shrink-0 rounded-md overflow-hidden bg-muted">
                  <img 
                    src={news.foto || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=200"}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
              {index < articles.length - 1 && (
                <Separator className="mt-6" />
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
