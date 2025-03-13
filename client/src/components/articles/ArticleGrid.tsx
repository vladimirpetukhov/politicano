import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Article } from "@shared/schema";
import { ArticleCard } from "./ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ArticleGridProps {
  articles: Article[];
  loading: boolean;
  variant?: "default" | "compact";
}

export function ArticleGrid({ articles, loading, variant = "default" }: ArticleGridProps) {
  if (loading) {
    return (
      <div className={`grid ${
        variant === "default" 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
          : "grid-cols-1"
        } gap-6`}
      >
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[280px]" />
        ))}
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Няма намерени статии
      </div>
    );
  }

  return (
    <div className={`grid ${
      variant === "default" 
        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
        : "grid-cols-1"
      } gap-6`}
    >
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}