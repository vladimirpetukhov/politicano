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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertArticleSchema } from "@shared/schema";
import type { InsertArticle } from "@shared/schema";
import { RichTextEditor } from "@/components/articles/RichTextEditor";

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
        title: "Успех",
        description: "Статията е публикувана успешно",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Грешка",
        description: "Неуспешно публикуване на статията",
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
          <CardTitle>Създай Нова Статия</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Input
                placeholder="Заглавие на статията"
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
              <RichTextEditor
                content={form.getValues("content")}
                onChange={(content) => form.setValue("content", content)}
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
                Отказ
              </Button>
              <Button type="submit" disabled={submitting}>
                Публикувай
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}