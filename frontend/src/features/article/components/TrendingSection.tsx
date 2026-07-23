import { Link } from "react-router";
import { Separator } from "@/components/ui/separator";
import { Clock } from "lucide-react";
import { formatTime as defaultFormatTime } from "@/lib/utils";
import type { NewsArticle } from "@/types/news";

interface TrendingSectionProps {
  articles: NewsArticle[];
  formatDate: (dateString: string) => string;
  formatTime?: (dateString: string) => string;
}

export function TrendingSection({ articles, formatDate, formatTime }: TrendingSectionProps) {
  const timeFormatter = formatTime || defaultFormatTime;

  return (
    <aside className="space-y-6 sticky top-24 self-start">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-6 bg-primary rounded-full"></div>
        <h2 className="text-2xl font-bold">Trending Now</h2>
      </div>

      <div className="bg-muted/30 rounded-xl p-6 border">
        <div className="space-y-6">
          {articles.map((news, index) => {
            const realTime = timeFormatter(news.createdAt);
            return (
              <div key={news._id}>
                <Link to={`/news/${news.slug}`} className="group flex gap-4 items-start">
                  <span className="text-3xl font-bold text-muted-foreground/30 font-serif leading-none mt-1">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  <div className="flex-1 space-y-1">
                    {news.category && (
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider">{news.category}</p>
                    )}
                    <h4 className="font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {news.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 flex-wrap">
                      <span className="font-medium">{news.author?.fullName || "Admin"}</span>
                      <span>•</span>
                      <span>{formatDate(news.createdAt)}</span>
                      {realTime && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            {realTime}
                          </span>
                        </>
                      )}
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
            );
          })}
        </div>
      </div>
    </aside>
  );
}

