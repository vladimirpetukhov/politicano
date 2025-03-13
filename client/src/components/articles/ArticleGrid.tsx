import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Article } from "@shared/schema";
import { ArticleCard } from "./ArticleCard";

interface ArticleGridProps {
  articles: Article[];
  loading: boolean;
}

export function ArticleGrid({ articles, loading }: ArticleGridProps) {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!articles.length) {
    return <div>Няма намерени статии</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}