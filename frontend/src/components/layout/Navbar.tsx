import { Link } from "react-router";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl tracking-tight">
          MenteriKebenaran
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium hover:underline">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
