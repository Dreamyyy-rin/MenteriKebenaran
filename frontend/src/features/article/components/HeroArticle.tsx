import { Link } from "react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { NewsArticle } from "@/types/news";

interface HeroArticleProps {
  article: NewsArticle;
  formatDate: (dateString: string) => string;
}

export function HeroArticle({ article, formatDate }: HeroArticleProps) {
  return (
    <Link to={`/news/${article.slug}`} className="group block mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center border-b border-border pb-10">
        <div className="w-full aspect-video overflow-hidden bg-muted rounded-2xl">
          <img
            src={article.foto || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000"}
            alt={article.title}
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
          />
        </div>

        <div className="flex flex-col justify-center py-4">
          <div className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Headline News
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-foreground group-hover:underline decoration-primary mb-6">
            {article.title}
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed line-clamp-3 mb-8">
            {article.artikel.replace(/<[^>]*>?/gm, '')}
          </p>

          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 rounded-none">
              <AvatarFallback className="bg-muted text-foreground text-sm font-semibold rounded-none">
                {article.author?.fullName?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {article.author?.fullName || "Admin"}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <span>{formatDate(article.createdAt)}</span>
                <span>•</span>
                <span>{Math.ceil(article.artikel.length / 200)} min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
