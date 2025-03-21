import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { loginWithEmail, registerWithEmail } from "@/lib/auth";
import { loginWithGoogle } from "@/lib/firebase";
import { SiGoogle, SiFacebook } from "react-icons/si";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const loginSchema = z.object({
  email: z.string().email("Невалиден имейл адрес"),
  password: z.string().min(6, "Паролата трябва да е поне 6 символа"),
});

const registerSchema = z.object({
  email: z.string().email("Невалиден имейл адрес"),
  password: z.string().min(6, "Паролата трябва да е поне 6 символа"),
  confirmPassword: z.string().min(6, "Паролата трябва да е поне 6 символа"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Паролите не съвпадат",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [loading, setLoading] = useState(false);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  const onLogin = async (data: LoginForm) => {
    setLoading(true);
    try {
      await loginWithEmail(data.email, data.password);
      toast({
        title: "Успех",
        description: "Влязохте успешно в системата",
      });
    } catch (error) {
      toast({
        title: "Грешка",
        description: "Невалиден имейл или парола",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (data: RegisterForm) => {
    setLoading(true);
    try {
      await registerWithEmail(data.email, data.password);
      toast({
        title: "Успех",
        description: "Изпратихме Ви имейл за потвърждение на регистрацията",
      });
    } catch (error) {
      toast({
        title: "Грешка",
        description: error instanceof Error ? error.message : "Възникна грешка при регистрацията",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">Вход в системата</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Имейл адрес"
                    {...loginForm.register("email")}
                    disabled={loading}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Парола"
                    {...loginForm.register("password")}
                    disabled={loading}
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  Вход
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Имейл адрес"
                    {...registerForm.register("email")}
                    disabled={loading}
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Парола"
                    {...registerForm.register("password")}
                    disabled={loading}
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Повтори паролата"
                    {...registerForm.register("confirmPassword")}
                    disabled={loading}
                  />
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {registerForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  Регистрация
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                или
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Button 
              className="w-full flex items-center justify-center gap-2" 
              onClick={loginWithGoogle}
              variant="outline"
              disabled={loading}
            >
              <SiGoogle className="h-5 w-5" />
              Влез с Google
            </Button>
            <Button 
              className="w-full flex items-center justify-center gap-2" 
              onClick={loginWithGoogle}
              variant="outline"
              disabled={loading}
            >
              <SiFacebook className="h-5 w-5" />
              Влез с Facebook
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}