import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Article } from "@shared/schema";
import { format } from "date-fns";
import { Link } from "wouter";
import { Eye, ThumbsUp, Clock } from "lucide-react";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/article/${article.id}`}>
      <Card className="cursor-pointer group hover:shadow-lg transition-all duration-300 border-slate-200 overflow-hidden">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="line-clamp-3 text-muted-foreground mb-4">{article.content}</p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{format(new Date(article.publishDate), "d MMM yyyy")}</span>
            </div>

            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{article.views}</span>
            </div>

            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              <span>{article.likes}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}