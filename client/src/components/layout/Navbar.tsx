import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { mockLogout } from "@/lib/auth";

export function Navbar() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <a className="text-2xl font-bold">Политически Блог</a>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {(user.role === "admin" || user.role === "blogger") && (
                <Link href="/create-article">
                  <Button variant="outline">Напиши статия</Button>
                </Link>
              )}
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