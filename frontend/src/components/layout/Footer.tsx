import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="w-full bg-muted/30 py-12 mt-20 border-t border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-2xl font-bold tracking-tight text-foreground">PBP Jaya</span>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PBP Jaya. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
