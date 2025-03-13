import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useToast } from "@/hooks/use-toast";
import { User, Loader2 } from "lucide-react";
import { uploadAvatar } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateUserProfile } from "@/lib/auth";

export default function Profile() {
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

    // Basic file validation
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 2MB",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      console.log("Starting upload for file:", file.name);

      // Upload to Firebase Storage
      const downloadURL = await uploadAvatar(file);
      console.log("Upload successful, URL:", downloadURL);

      // Update user profile
      await updateUserProfile(user.displayName || "", downloadURL);
      console.log("Profile updated with new avatar");

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6">
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
                Maximum file size: 2MB
              </p>
            </div>

            <div className="w-full max-w-sm">
              <Input
                type="email"
                value={user.email}
                disabled
                className="text-center"
              />
              <p className="text-sm text-muted-foreground text-center mt-2">
                {user.role === "admin" ? "Administrator" : 
                 user.role === "blogger" ? "Blogger" : 
                 "User"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}