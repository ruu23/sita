import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; to?: "/home" | "/brands" };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-border bg-background">
      <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 gap-y-1 px-4 py-3 sm:px-6">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-2">
              {i > 0 ? (
                <ChevronRight
                  className="h-3 w-3 shrink-0 text-muted-foreground/60"
                  strokeWidth={1.6}
                  aria-hidden
                />
              ) : null}
              {c.to && !last ? (
                <Link
                  to={c.to}
                  className="label-caps text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  {c.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className="label-caps text-foreground"
                >
                  {c.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
