import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="w-full bg-gradient-to-br from-primary/5 via-background to-blue-500/5 py-16 mt-20 border-t-2 border-primary/10">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-6 flex justify-center">
          <span className="text-4xl bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent font-extrabold tracking-tight">PBP Jaya 🚀</span>
        </div>
        <p className="text-muted-foreground font-medium text-base max-w-md mx-auto mb-10 leading-relaxed">
          Sumber berita terpercaya Anda. Selalu memberikan informasi yang akurat dan terdepan.
        </p>
        <Separator className="mb-8" />
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} PBP Jaya. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
