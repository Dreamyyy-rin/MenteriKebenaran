import { Link } from "react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { NewsArticle } from "@/types/news";

interface HeroArticleProps {
  article: NewsArticle;
  formatDate: (dateString: string) => string;
}

export function HeroArticle({ article, formatDate }: HeroArticleProps) {
  return (
    <Link to={`/news/${article.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-card border-2 border-border/40 shadow-sm hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 aspect-[16/10] w-full overflow-hidden relative">
            <img
              src={article.foto || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000"}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center p-8 lg:p-12">
            <div className="mb-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full">
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

              <span className="text-xs text-muted-foreground font-normal">
                {Math.ceil(article.artikel.length / 200)} min read
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
