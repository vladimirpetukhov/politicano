import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockLogin } from "@/lib/auth";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function Login() {
  const [, setLocation] = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">Влезте в системата</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" onClick={() => mockLogin("admin")}>
            Влез като Админ
          </Button>
          <Button className="w-full" onClick={() => mockLogin("blogger")}>
            Влез като Блогър
          </Button>
          <Button className="w-full" onClick={() => mockLogin("user")}>
            Влез като Потребител
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}