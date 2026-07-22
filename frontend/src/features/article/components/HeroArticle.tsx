import { Link } from "react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock } from "lucide-react";
import { formatTime as defaultFormatTime } from "@/lib/utils";
import type { NewsArticle } from "@/types/news";

interface HeroArticleProps {
  article: NewsArticle;
  formatDate: (dateString: string) => string;
  formatTime?: (dateString: string) => string;
}

export function HeroArticle({ article, formatDate, formatTime }: HeroArticleProps) {
  const timeFormatter = formatTime || defaultFormatTime;
  const realTime = timeFormatter(article.createdAt);

  return (
    <Link to={`/news/${article.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 aspect-[16/10] w-full overflow-hidden rounded-xl relative">
            <img
              src={article.foto || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000"}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
          </div>

          <div className="lg:col-span-5 space-y-4 lg:pr-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Headline News
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold tracking-tight leading-snug text-foreground group-hover:text-primary transition-colors">
              {article.title}
            </h1>

            <p className="text-muted-foreground text-sm md:text-base leading-relaxed line-clamp-3 font-normal">
              {article.artikel.replace(/<[^>]*>?/gm, '')}
            </p>

            <div className="pt-4 border-t border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-muted text-foreground text-xs font-medium">
                    {article.author?.fullName?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-medium text-foreground leading-none">
                    {article.author?.fullName || "Admin"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {formatDate(article.createdAt)}
                  </p>
                </div>
              </div>

              {realTime && (
                <span className="text-xs text-muted-foreground font-normal flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {realTime}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

