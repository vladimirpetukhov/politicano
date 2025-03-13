import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { mockLogout } from "@/lib/auth";
import { UserCircle } from "lucide-react";

export function Navbar() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <Button variant="link" className="text-2xl font-bold p-0">
            Политически Блог
          </Button>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {(user.role === "admin" || user.role === "blogger") && (
                <Link href="/create-article">
                  <Button variant="outline">Напиши статия</Button>
                </Link>
              )}
              <Link href="/profile">
                <Button variant="ghost" className="gap-2">
                  <UserCircle className="h-5 w-5" />
                  Профил
                </Button>
              </Link>
              <Button variant="ghost" onClick={mockLogout}>
                Изход
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button>Вход</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}