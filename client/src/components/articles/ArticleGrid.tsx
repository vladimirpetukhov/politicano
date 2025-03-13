import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ArticleCard } from "./ArticleCard";

export function ArticleGrid() {
  const { articles, loading } = useSelector((state: RootState) => state.articles);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.slice(0, 12).map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
