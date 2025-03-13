import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useToast } from "@/hooks/use-toast";
import { User, Loader2 } from "lucide-react";
import { uploadAvatar } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateUserProfile } from "@/lib/auth";

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  // Redirect if not logged in
  if (!user) {
    setLocation("/login");
    return null;
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      // Upload to Firebase Storage and get URL
      const avatarUrl = await uploadAvatar(file);
      console.log("Avatar URL:", avatarUrl);

      // Update Firebase user profile
      await updateUserProfile(user.displayName || "", avatarUrl);

      toast({
        title: "Успех",
        description: "Снимката е качена успешно",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Грешка",
        description: "Неуспешно качване на снимката",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Моят профил</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32">
              {uploading ? (
                <div className="h-full w-full flex items-center justify-center bg-muted">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <>
                  <AvatarImage src={user.avatarUrl || undefined} />
                  <AvatarFallback>
                    <User className="h-16 w-16" />
                  </AvatarFallback>
                </>
              )}
            </Avatar>

            <div className="w-full max-w-sm">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="mb-2"
              />
              <p className="text-sm text-muted-foreground text-center">
                Максимален размер: 2MB
              </p>
            </div>

            <div className="w-full max-w-sm mt-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  value={user.email}
                  disabled
                  className="text-center"
                />
                <p className="text-sm text-muted-foreground text-center">
                  {user.role === "admin" ? "Администратор" : 
                   user.role === "blogger" ? "Блогър" : 
                   "Потребител"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}