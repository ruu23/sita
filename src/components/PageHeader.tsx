import { Link } from "@tanstack/react-router";
import { Heart, Search, Sparkles, User } from "lucide-react";

export function PageHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl min-h-16 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-5 py-4 sm:px-8 lg:px-12">
        <p className="label-caps min-w-0 truncate text-muted-foreground">{title}</p>
        <Link to="/home" className="wordmark justify-self-center text-2xl sm:text-3xl">
          SITA
        </Link>
        <div className="hidden items-center justify-self-end gap-4 md:flex lg:gap-5">
          <Link to="/brands" className="label-caps hover:text-espresso">
            Brands
          </Link>
          <Link to="/search" aria-label="Search" title="Search">
            <Search className="h-5 w-5" strokeWidth={1.4} />
          </Link>
          <Link to="/stylist" aria-label="AI Stylist" title="AI Stylist">
            <Sparkles className="h-5 w-5" strokeWidth={1.4} />
          </Link>
          <Link to="/wishlist" aria-label="Wishlist" title="Wishlist">
            <Heart className="h-5 w-5" strokeWidth={1.4} />
          </Link>
          <Link to="/me" aria-label="Profile" title="Profile">
            <User className="h-5 w-5" strokeWidth={1.4} />
          </Link>
        </div>
      </div>
    </header>
  );
}
