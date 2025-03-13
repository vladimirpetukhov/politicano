import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { mockLogin } from "@/lib/auth";
import { SiGoogle, SiFacebook } from "react-icons/si";
import { Separator } from "@/components/ui/separator";

interface LoginForm {
  username: string;
  password: string;
}

export default function Login() {
  const [, setLocation] = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const onSubmit = (data: LoginForm) => {
    mockLogin(data.username, data.password);
  };

  // В реална среда тези функции ще правят истинска автентикация
  const handleGoogleLogin = () => {
    mockLogin(); // За тестови цели
  };

  const handleFacebookLogin = () => {
    mockLogin(); // За тестови цели
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">Влезте в системата</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Потребителско име"
                {...register("username", { required: "Полето е задължително" })}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Парола"
                {...register("password", { required: "Полето е задължително" })}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Вход
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                или
              </span>
            </div>
          </div>

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