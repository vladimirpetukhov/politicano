import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Article } from "@shared/schema";
import { format } from "date-fns";
import { Link } from "wouter";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/article/${article.id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="line-clamp-2">{article.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-muted-foreground">{article.content}</p>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          <div className="flex justify-between w-full">
            <span>{format(new Date(article.publishDate), "MMM d, yyyy")}</span>
            <div className="flex gap-4">
              <span>{article.views} views</span>
              <span>{article.likes} likes</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
