import { Link } from "@tanstack/react-router";
import { Home, Search, Heart, User } from "lucide-react";

const items = [
  { label: "Home", icon: Home, to: "/home" },
  { label: "Search", icon: Search, to: "/search" },
  { label: "Wishlist", icon: Heart, to: "/wishlist" },
  { label: "Me", icon: User, to: "/me" },
] as const;

export function BottomNav({ active = "Home" }: { active?: string }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur md:hidden">
      <ul className="mx-auto grid max-w-lg grid-cols-4">
        {items.map(({ label, icon: Icon, to }) => (
          <li key={label}>
            <Link
              to={to}
              className={`flex flex-col items-center gap-1 py-3 transition-colors ${
                active === label ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.4} />
              <span className="label-caps">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
