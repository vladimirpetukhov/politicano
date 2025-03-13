import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { User } from "@shared/schema";
import { mockUsers } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { User as UserIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function AuthorSubscriptions() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [authors, setAuthors] = useState<User[]>([]);
  const [subscriptions, setSubscriptions] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);

  useEffect(() => {
    // Immediately set authors from mock data
    const bloggers = mockUsers.filter(user => 
      user.role === "blogger" || user.role === "admin"
    );
    setAuthors(bloggers);

    // Then load subscriptions if user is logged in
    if (currentUser) {
      loadSubscriptions();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const loadSubscriptions = async () => {
    try {
      const subsQuery = query(
        collection(db, "author_subscriptions"),
        where("userId", "==", currentUser?.uid)
      );
      const snapshot = await getDocs(subsQuery);
      const subs = new Set<string>();
      snapshot.forEach(doc => {
        subs.add(doc.data().authorId);
      });
      setSubscriptions(subs);
    } catch (error) {
      console.error("Error loading subscriptions:", error);
      toast({
        title: "Грешка",
        description: "Неуспешно зареждане на абонаментите",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSubscription = async (authorId: string) => {
    if (!currentUser) return;

    setToggleLoading(authorId);
    try {
      const subsQuery = query(
        collection(db, "author_subscriptions"),
        where("userId", "==", currentUser.uid),
        where("authorId", "==", authorId)
      );
      const snapshot = await getDocs(subsQuery);

      if (subscriptions.has(authorId)) {
        // Unsubscribe
        const doc = snapshot.docs[0];
        if (doc) {
          await deleteDoc(doc.ref);
          setSubscriptions(prev => {
            const newSet = new Set(prev);
            newSet.delete(authorId);
            return newSet;
          });
        }
      } else {
        // Subscribe
        await addDoc(collection(db, "author_subscriptions"), {
          userId: currentUser.uid,
          authorId: authorId,
          createdAt: new Date().toISOString()
        });
        setSubscriptions(prev => {
          const newSet = new Set(prev);
          newSet.add(authorId);
          return newSet;
        });
      }

      toast({
        title: "Успех",
        description: subscriptions.has(authorId) 
          ? "Отписахте се успешно" 
          : "Абонирахте се успешно",
      });
    } catch (error) {
      console.error("Error toggling subscription:", error);
      toast({
        title: "Грешка",
        description: "Възникна грешка при промяна на абонамента",
        variant: "destructive",
      });
    } finally {
      setToggleLoading(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Абонаменти за автори</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
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
              <div className="flex items-center gap-2">
                {toggleLoading === author.uid ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Switch
                    checked={subscriptions.has(author.uid)}
                    onCheckedChange={() => toggleSubscription(author.uid)}
                  />
                )}
              </div>
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