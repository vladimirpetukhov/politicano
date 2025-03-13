import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { doc, getDoc, collection, addDoc, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Article, Comment } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArticlePage() {
  const [, params] = useRoute("/article/:id");
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const { toast } = useToast();

  useEffect(() => {
    const fetchArticle = async () => {
      if (!params?.id) return;

      try {
        const docRef = doc(db, "articles", params.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setArticle({
            id: docSnap.id,
            ...docSnap.data()
          } as Article);

          // Fetch comments
          const commentsQuery = query(
            collection(db, "comments"),
            where("articleId", "==", parseInt(params.id)),
            orderBy("createdAt", "desc")
          );
          const commentsSnap = await getDocs(commentsQuery);
          setComments(commentsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Comment[]);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load article",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params?.id, toast]);

  const handleSubmitComment = async () => {
    if (!user || !article || !newComment.trim()) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, "comments"), {
        content: newComment,
        articleId: article.id,
        authorId: user.uid,
        createdAt: new Date().toISOString()
      });

      setNewComment("");
      toast({
        title: "Success",
        description: "Comment posted successfully"
      });

      // Refresh comments
      const commentsQuery = query(
        collection(db, "comments"),
        where("articleId", "==", article.id),
        orderBy("createdAt", "desc")
      );
      const commentsSnap = await getDocs(commentsQuery);
      setComments(commentsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <article className="prose prose-lg max-w-none mb-12">
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <div className="flex items-center gap-4 text-muted-foreground mb-8">
          <span>{format(new Date(article.publishDate), "MMMM d, yyyy")}</span>
          <span>•</span>
          <span>{article.views} views</span>
          <span>•</span>
          <span>{article.likes} likes</span>
        </div>
        <div className="whitespace-pre-wrap">{article.content}</div>
      </article>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Comments</h2>
        
        {user ? (
          <Card>
            <CardContent className="pt-6">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-4"
              />
              <Button 
                onClick={handleSubmitComment}
                disabled={submitting || !newComment.trim()}
              >
                Post Comment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-4 text-center text-muted-foreground">
              Please login to comment
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader>
                <CardTitle className="text-base font-normal">
                  {comment.content}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
