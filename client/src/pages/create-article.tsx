import { useState } from "react";
import { useLocation } from "wouter";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertArticleSchema } from "@shared/schema";
import type { InsertArticle } from "@shared/schema";

export default function CreateArticle() {
  const [, setLocation] = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<InsertArticle>({
    resolver: zodResolver(insertArticleSchema),
    defaultValues: {
      title: "",
      content: "",
      authorId: user?.uid || "",
    },
  });

  // Redirect if not authorized
  if (!user || (user.role !== "admin" && user.role !== "blogger")) {
    setLocation("/");
    return null;
  }

  const onSubmit = async (data: InsertArticle) => {
    setSubmitting(true);
    try {
      await addDoc(collection(db, "articles"), {
        ...data,
        publishDate: new Date().toISOString(),
        views: 0,
        likes: 0,
      });

      toast({
        title: "Success",
        description: "Article published successfully",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish article",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Article</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Input
                placeholder="Article Title"
                {...form.register("title")}
                className="text-xl font-semibold"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Write your article content here..."
                {...form.register("content")}
                className="min-h-[400px]"
              />
              {form.formState.errors.content && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.content.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                Publish Article
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
