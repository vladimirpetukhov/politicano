import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { mockArticles } from "@/lib/mockData";
import { setArticles, setLoading } from "@/store/slices/articleSlice";
import { ArticleGrid } from "@/components/articles/ArticleGrid";
import { ArticleFilters } from "@/components/articles/ArticleFilters";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    // Симулираме зареждане на статии
    setTimeout(() => {
      dispatch(setArticles(mockArticles));
      dispatch(setLoading(false));
    }, 500);
  }, [dispatch]);

  // Сортираме статиите по различни критерии
  const recentArticles = [...mockArticles].sort((a, b) => 
    b.publishDate.getTime() - a.publishDate.getTime()
  ).slice(0, 12);

  const mostLikedArticles = [...mockArticles].sort((a, b) => b.likes - a.likes).slice(0, 5);
  const mostViewedArticles = [...mockArticles].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-bold mb-6">Последни Публикации</h2>
        <ArticleFilters />
        <ArticleGrid articles={recentArticles} />
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">Най-Харесвани Статии</h2>
        <ArticleGrid articles={mostLikedArticles} />
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6">Най-Четени Статии</h2>
        <ArticleGrid articles={mostViewedArticles} />
      </section>
    </div>
  );
}