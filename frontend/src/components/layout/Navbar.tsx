import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LayoutDashboard, LogOut, Newspaper } from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  fullName: string;
  email: string;
  username: string;
  role: string;
}

export function Navbar() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        setCurrentUser(JSON.parse(userJson));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setIsMenuOpen(false);
    toast.success("Berhasil keluar!");
    navigate("/");
  }

  const isAdmin = currentUser?.role?.toLowerCase() === "admin";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Newspaper className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold tracking-tight text-foreground">
            Menteri<span className="text-primary">Kebenaran</span>
          </span>
        </Link>

        {/* Center: Simple Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-muted-foreground/80">
          <Link to="/" className="hover:text-primary hover:-translate-y-0.5 transition-all">
            Beranda
          </Link>
          <Link to="/news" className="hover:text-primary hover:-translate-y-0.5 transition-all">
            Berita
          </Link>
          <Link to="/articles" className="hover:text-foreground transition-colors">
            Artikel
          </Link>
        </nav>

        {/* Right: Auth Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            /* POPUP AVATAR SAAT SUDAH LOGIN */
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 transition-transform active:scale-95 cursor-pointer"
                title={currentUser.fullName}
              >
                <Avatar className="h-9 w-9 border border-border shadow-sm">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                    {currentUser.fullName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </button>

              {/* POPUP MENU MINIMALIS & NATURAL */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-card border border-border/50 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  {/* Nama & Email */}
                  <div className="px-4 py-3 border-b border-border/40">
                    <p className="text-sm font-semibold text-foreground truncate leading-tight">
                      {currentUser.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground/80 truncate mt-1">
                      {currentUser.email}
                    </p>
                  </div>

                  {/* Menu Options */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate("/dashboard");
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-2.5 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                      Dashboard
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2.5 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="font-medium text-muted-foreground hover:text-foreground">
                  Masuk
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="font-medium px-5">
                  Daftar
                </Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
