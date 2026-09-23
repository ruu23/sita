import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, ShoppingBag, Search, X } from "lucide-react";
import { listNewArrivals } from "@/lib/products.functions";
import { BRANDS, type Product } from "@/lib/brands";
import { ProductCard } from "@/components/ProductCard";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "New In — SITA" },
      {
        name: "description",
        content:
          "Live new arrivals from Naseeji, Roaia Studio, Frenchee The Label and TGS, gathered in one feed.",
      },
      { property: "og:title", content: "New In — SITA" },
      {
        property: "og:description",
        content: "Live new arrivals from Egypt's local fashion labels in one feed.",
      },
    ],
  }),
  loader: () => listNewArrivals(),
  component: HomePage,
  errorComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-6 text-center">
      <p className="text-sm text-muted-foreground">
        We couldn&apos;t load new arrivals right now. Please refresh.
      </p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-6">
      <p className="text-sm text-muted-foreground">Nothing here.</p>
    </div>
  ),
});

function Carousel({ items }: { items: Product[] }) {
  const [i, setI] = useState(0);
  if (items.length === 0) return null;
  const current = items[Math.min(i, items.length - 1)]!;

  return (
    <section className="relative bg-ink">
      <a href={current.url} target="_blank" rel="noreferrer" className="block">
        <div className="aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
          {current.image ? (
            <img
              src={current.image}
              alt={current.title}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
      </a>
      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
        {items.map((it, idx) => (
          <button
            key={it.id}
            aria-label={`Slide ${idx + 1}`}
            onClick={() => setI(idx)}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              idx === Math.min(i, items.length - 1) ? "bg-ivory" : "bg-ivory/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

function HomePage() {
  const products = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const q = query.trim().toLowerCase();
  const filtered = products.filter(
    (p) =>
      (!brand || p.brandSlug === brand) &&
      (q === "" || `${p.title} ${p.brand}`.toLowerCase().includes(q)),
  );

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:px-6">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            className="md:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" strokeWidth={1.4} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.4} />
            )}
          </button>

          <nav className="hidden md:flex md:items-center md:gap-6">
            <button
              onClick={() => setBrand(null)}
              className={`label-caps transition-colors ${brand === null ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              All brands
            </button>
            {BRANDS.map((b) => (
              <button
                key={b.slug}
                onClick={() => setBrand(b.slug)}
                className={`label-caps transition-colors ${brand === b.slug ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {b.name}
              </button>
            ))}
          </nav>

          <Link to="/" className="wordmark justify-self-center text-xl sm:text-2xl">
            Sita
          </Link>

          <ShoppingBag className="h-5 w-5 justify-self-end" strokeWidth={1.4} />
        </div>

        {menuOpen ? (
          <div className="border-t border-border px-4 py-3 md:hidden">
            <div className="flex flex-wrap gap-x-5 gap-y-3">
              <button
                onClick={() => {
                  setBrand(null);
                  setMenuOpen(false);
                }}
                className={`label-caps ${brand === null ? "text-foreground" : "text-muted-foreground"}`}
              >
                All brands
              </button>
              {BRANDS.map((b) => (
                <button
                  key={b.slug}
                  onClick={() => {
                    setBrand(b.slug);
                    setMenuOpen(false);
                  }}
                  className={`label-caps ${brand === b.slug ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </header>

      <Carousel items={products.slice(0, 3)} />

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="py-8 text-center sm:py-10">
          <h2 className="text-2xl tracking-[0.18em] uppercase sm:text-3xl">New In</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Discover the latest in elegance and style!
          </p>
        </div>

        <div className="relative mx-auto max-w-md pb-8">
          <Search
            className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.4}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a piece, e.g. black skirt"
            className="h-11 w-full rounded-full border border-input bg-card pr-4 pl-11 text-sm focus:border-ring focus:outline-none"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No pieces match “{query}” yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 pb-16 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <footer className="hidden border-t border-border py-10 text-center md:block">
        <p className="wordmark text-lg">Sita</p>
        <p className="mt-3 text-xs text-muted-foreground">
          Egyptian local labels, gathered in one search.
        </p>
      </footer>

      <BottomNav active="Home" />
    </div>
  );
}
