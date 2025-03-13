import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { mockLogin } from "@/lib/auth";
import { SiGoogle, SiFacebook } from "react-icons/si";

export default function Login() {
  const [, setLocation] = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  // В реална среда тези функции ще правят истинска автентикация
  const handleGoogleLogin = () => {
    mockLogin(); // За тестови цели винаги връща потребител с роля "user"
  };

  const handleFacebookLogin = () => {
    mockLogin(); // За тестови цели винаги връща потребител с роля "user"
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">Влезте в системата</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full flex items-center justify-center gap-2" 
            onClick={handleGoogleLogin}
            variant="outline"
          >
            <SiGoogle className="h-5 w-5" />
            Влез с Google
          </Button>
          <Button 
            className="w-full flex items-center justify-center gap-2" 
            onClick={handleFacebookLogin}
            variant="outline"
          >
            <SiFacebook className="h-5 w-5" />
            Влез с Facebook
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}