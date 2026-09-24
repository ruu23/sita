import { Link } from "@tanstack/react-router";
import { Heart, Search } from "lucide-react";

export function PageHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-4 py-4 sm:px-6">
        <p className="label-caps text-muted-foreground">{title}</p>
        <Link to="/home" className="wordmark justify-self-center text-xl sm:text-2xl">
          Sita
        </Link>
        <div className="hidden justify-self-end gap-5 md:flex">
          <Link to="/search" aria-label="Search">
            <Search className="h-5 w-5" strokeWidth={1.4} />
          </Link>
          <Link to="/wishlist" aria-label="Wishlist">
            <Heart className="h-5 w-5" strokeWidth={1.4} />
          </Link>
        </div>
      </div>
    </header>
  );
}
