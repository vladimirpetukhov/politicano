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

export function AuthorSubscriptions() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [authors, setAuthors] = useState<User[]>([]);
  const [subscriptions, setSubscriptions] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    // В реална среда ще зареждаме от базата данни
    const bloggers = mockUsers.filter(user => 
      user.role === "blogger" || user.role === "admin"
    );
    setAuthors(bloggers);
  }, []);

  const toggleSubscription = async (authorId: string) => {
    try {
      // TODO: Implement subscription toggle logic
      if (subscriptions.has(authorId)) {
        subscriptions.delete(authorId);
      } else {
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
      toast({
        title: "Грешка",
        description: "Възникна грешка при промяна на абонамента",
        variant: "destructive",
      });
    }
  };

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
