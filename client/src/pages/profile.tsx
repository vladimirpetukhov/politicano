import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "wouter";
import { RootState } from "@/store/store";
import { UpdateUser, ChangePassword } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema, changePasswordSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { User } from "lucide-react";
import { AuthorSubscriptions } from "@/components/profile/AuthorSubscriptions";
import { updateUserProfile, changePassword } from "@/lib/auth";
import { uploadAvatar } from "@/lib/firebase";

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const profileForm = useForm<UpdateUser>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      displayName: user?.displayName || "",
      avatarUrl: user?.avatarUrl || "",
    },
  });

  const passwordForm = useForm<ChangePassword>({
    resolver: zodResolver(changePasswordSchema),
  });

  // Redirect if not logged in
  if (!user) {
    setLocation("/login");
    return null;
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Грешка",
        description: "Файлът трябва да е по-малък от 2MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Грешка",
        description: "Моля, изберете изображение",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      console.log('Starting avatar upload for file:', file.name);
      const avatarUrl = await uploadAvatar(file);
      console.log('Avatar uploaded successfully:', avatarUrl);

      await updateUserProfile(profileForm.getValues("displayName"), avatarUrl);
      console.log('Profile updated with new avatar');

      // Update form value
      profileForm.setValue("avatarUrl", avatarUrl);

      toast({
        title: "Успех",
        description: "Снимката е качена успешно",
      });
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast({
        title: "Грешка",
        description: "Неуспешно качване на снимката. Моля, опитайте отново.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset the input field to allow uploading the same file again
      e.target.value = '';
    }
  };

  const onUpdateProfile = async (data: UpdateUser) => {
    setSaving(true);
    try {
      await updateUserProfile(data.displayName, data.avatarUrl);
      toast({
        title: "Успех",
        description: "Профилът е обновен успешно",
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Грешка",
        description: "Неуспешно обновяване на профила",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async (data: ChangePassword) => {
    setSaving(true);
    try {
      await changePassword(data.currentPassword, data.newPassword);
      toast({
        title: "Успех",
        description: "Паролата е променена успешно",
      });
      passwordForm.reset();
    } catch (error) {
      console.error("Password change error:", error);
      toast({
        title: "Грешка",
        description: "Неуспешна промяна на паролата",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Профил</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Профил</TabsTrigger>
              <TabsTrigger value="security">Сигурност</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatarUrl || undefined} />
                  <AvatarFallback>
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                    className="mb-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    Максимален размер: 2MB
                  </p>
                </div>
              </div>

              <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Име"
                    {...profileForm.register("displayName")}
                    disabled={saving}
                  />
                  {profileForm.formState.errors.displayName && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.displayName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Input
                    type="email"
                    value={user.email}
                    disabled
                  />
                  <p className="text-sm text-muted-foreground">
                    Имейлът не може да бъде променен
                  </p>
                </div>

                <Button type="submit" disabled={saving}>
                  Запази промените
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Текуща парола"
                    {...passwordForm.register("currentPassword")}
                    disabled={saving}
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Нова парола"
                    {...passwordForm.register("newPassword")}
                    disabled={saving}
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Повтори новата парола"
                    {...passwordForm.register("confirmPassword")}
                    disabled={saving}
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={saving}>
                  Промени паролата
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <AuthorSubscriptions />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}