import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { User } from "@shared/schema";
import { mockUsers } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { User as UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function AuthorSubscriptions() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [authors, setAuthors] = useState<User[]>([]);
  const [subscriptions, setSubscriptions] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // В реална среда ще зареждаме от базата данни
    const bloggers = mockUsers.filter(user => 
      user.role === "blogger" || user.role === "admin"
    );
    setAuthors(bloggers);
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    if (!currentUser) return;

    try {
      const subsQuery = query(
        collection(db, "author_subscriptions"),
        where("userId", "==", currentUser.uid)
      );
      const snapshot = await getDocs(subsQuery);
      const subs = new Set<string>();
      snapshot.forEach(doc => {
        subs.add(doc.data().authorId);
      });
      setSubscriptions(subs);
    } catch (error) {
      console.error("Error loading subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubscription = async (authorId: string) => {
    if (!currentUser) return;

    try {
      const subsQuery = query(
        collection(db, "author_subscriptions"),
        where("userId", "==", currentUser.uid),
        where("authorId", "==", authorId)
      );
      const snapshot = await getDocs(subsQuery);

      if (subscriptions.has(authorId)) {
        // Unsubscribe
        snapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
        subscriptions.delete(authorId);
      } else {
        // Subscribe
        await addDoc(collection(db, "author_subscriptions"), {
          userId: currentUser.uid,
          authorId: authorId,
          createdAt: new Date().toISOString()
        });
        subscriptions.add(authorId);
      }
      setSubscriptions(new Set(subscriptions));

      toast({
        title: "Успех",
        description: subscriptions.has(authorId) 
          ? "Абонирахте се успешно" 
          : "Отписахте се успешно",
      });
    } catch (error) {
      console.error("Error toggling subscription:", error);
      toast({
        title: "Грешка",
        description: "Възникна грешка при промяна на абонамента",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Абонаменти за автори</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {authors.map((author) => (
            <div key={author.uid} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    <UserIcon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{author.email}</p>
                  <p className="text-sm text-muted-foreground">
                    {author.role === "admin" ? "Администратор" : "Блогър"}
                  </p>
                </div>
              </div>
              <Switch
                checked={subscriptions.has(author.uid)}
                onCheckedChange={() => toggleSubscription(author.uid)}
              />
            </div>
          ))}

          {authors.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Няма намерени автори
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}