import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Heart, Menu, ShoppingBag, Search, X } from "lucide-react";
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
  const trackRef = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  if (items.length === 0) return null;

  const goTo = (idx: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: idx * track.clientWidth, behavior: "smooth" });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const idx = Math.round(track.scrollLeft / track.clientWidth);
    setI(Math.max(0, Math.min(items.length - 1, idx)));
  };

  return (
    <section className="relative bg-transparent">
      <div
        ref={trackRef}
        onScroll={onScroll}
        tabIndex={0}
        aria-label="Featured pieces"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") goTo(Math.min(items.length - 1, i + 1));
          if (e.key === "ArrowLeft") goTo(Math.max(0, i - 1));
        }}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain touch-pan-x outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((it) => (
          <a
            key={it.id}
            href={it.url}
            target="_blank"
            rel="noreferrer"
            draggable={false}
            className="block w-full shrink-0 snap-center"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[4/3] lg:aspect-auto lg:h-[min(80vh,760px)]">
              {it.image ? (
                <>
                  <img
                    src={it.image}
                    alt=""
                    aria-hidden
                    draggable={false}
                    className="absolute inset-0 hidden h-full w-full scale-110 object-cover opacity-50 blur-2xl sm:block"
                  />
                  <img
                    src={it.image}
                    alt={it.title}
                    draggable={false}
                    className="relative h-full w-full object-cover sm:object-contain"
                  />
                </>
              ) : null}
            </div>
          </a>
        ))}
      </div>
      {items.length > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={() => goTo(Math.max(0, i - 1))}
            disabled={i === 0}
            className="absolute left-4 top-[45%] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-ivory backdrop-blur transition-opacity hover:bg-ink/80 disabled:opacity-0 md:flex"
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            onClick={() => goTo(Math.min(items.length - 1, i + 1))}
            disabled={i === items.length - 1}
            className="absolute right-4 top-[45%] hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-ivory backdrop-blur transition-opacity hover:bg-ink/80 disabled:opacity-0 md:flex"
          >
            ›
          </button>
        </>
      )}
      <div className="flex justify-center gap-2 py-3">
        {items.map((it, idx) => (
          <button
            key={it.id}
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => goTo(idx)}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              idx === i ? "bg-foreground" : "bg-foreground/30"
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

          <div className="flex items-center gap-5 justify-self-end">
            <Link to="/search" aria-label="Search" className="hidden md:block">
              <Search className="h-5 w-5" strokeWidth={1.4} />
            </Link>
            <Link to="/wishlist" aria-label="Wishlist" className="hidden md:block">
              <Heart className="h-5 w-5" strokeWidth={1.4} />
            </Link>
            <ShoppingBag className="h-5 w-5" strokeWidth={1.4} />
          </div>
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

        {brand ? (
          <div className="pb-8 text-center">
            <Link
              to="/brands/$slug"
              params={{ slug: brand }}
              className="label-caps text-espresso underline underline-offset-4"
            >
              View {BRANDS.find((b) => b.slug === brand)?.name} page
            </Link>
          </div>
        ) : null}


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

      <section className="border-t border-border bg-secondary px-4 py-12 sm:px-6">
        <h2 className="text-center text-2xl tracking-[0.18em] uppercase sm:text-3xl">Meet the brands</h2>
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-3 md:grid-cols-4">
          {BRANDS.map((b) => (
            <Link
              key={b.slug}
              to="/brands/$slug"
              params={{ slug: b.slug }}
              className="flex flex-col justify-between gap-4 border border-border bg-card p-5 hover:border-foreground"
            >
              <span className="wordmark text-lg">{b.name}</span>
              <span className="text-xs text-muted-foreground">{b.tagline}</span>
            </Link>
          ))}
        </div>
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
