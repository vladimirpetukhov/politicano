import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { mockArticles } from "@/lib/mockData";
import { setArticles, setLoading } from "@/store/slices/articleSlice";
import { ArticleGrid } from "@/components/articles/ArticleGrid";
import { ArticleFilters } from "@/components/articles/ArticleFilters";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Симулираме зареждане на статии
    dispatch(setLoading(true));
    setTimeout(() => {
      dispatch(setArticles(mockArticles));
      dispatch(setLoading(false));
    }, 500); // Добавяме малко закъснение за по-реалистично усещане
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Последни статии</h1>
      <ArticleFilters />
      <ArticleGrid />
    </div>
  );
}