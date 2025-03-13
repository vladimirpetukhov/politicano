import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { mockArticles } from "@/lib/mockData";
import { setArticles, setLoading } from "@/store/slices/articleSlice";
import { ArticleGrid } from "@/components/articles/ArticleGrid";
import { ArticleFilters } from "@/components/articles/ArticleFilters";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, ThumbsUp, Eye } from "lucide-react";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    // Load articles
    setTimeout(() => {
      dispatch(setArticles(mockArticles));
      dispatch(setLoading(false));
    }, 500);
  }, [dispatch]);

  // Sort articles by date using ISO strings
  const recentArticles = [...mockArticles].sort((a, b) =>
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  ).slice(0, 12);

  const mostLikedArticles = [...mockArticles].sort((a, b) => b.likes - a.likes).slice(0, 5);
  const mostViewedArticles = [...mockArticles].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative -mt-8 bg-gradient-to-r from-primary/90 to-primary px-4 py-16">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Политически Новини и Анализи
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Актуални политически новини, задълбочени анализи и експертни коментари от водещи политолози и журналисти.
          </p>
          <Button variant="secondary" size="lg" className="group">
            Разгледай всички статии
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>

      {/* Последни публикации */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Последни Публикации</h2>
            <p className="text-muted-foreground">Най-новото от нашите автори</p>
          </div>
          <ArticleFilters />
        </div>
        <ArticleGrid articles={recentArticles} loading={false} />
      </section>

      {/* Статистики секция */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Най-харесвани */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <ThumbsUp className="h-6 w-6 text-primary" />
                <h3 className="text-2xl font-bold">Най-Харесвани</h3>
              </div>
              <ArticleGrid articles={mostLikedArticles} loading={false} />
            </div>

            {/* Най-четени */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-6 w-6 text-primary" />
                <h3 className="text-2xl font-bold">Най-Четени</h3>
              </div>
              <ArticleGrid articles={mostViewedArticles} loading={false} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}