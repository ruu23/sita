import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { listNewArrivals } from "@/lib/products.functions";
import { BRANDS } from "@/lib/brands";
import { ProductCard } from "@/components/ProductCard";
import { BottomNav } from "@/components/BottomNav";
import { PageHeader } from "@/components/PageHeader";
import { PageIntro } from "@/components/PageIntro";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — SITA" },
      { name: "description", content: "Search one piece across every Egyptian local brand on SITA." },
      { property: "og:title", content: "Search — SITA" },
      { property: "og:description", content: "One search across Egypt's local fashion labels." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => listNewArrivals(),
  component: SearchPage,
  errorComponent: () => (
    <p className="p-10 text-center text-sm text-muted-foreground">Couldn&apos;t load pieces. Please refresh.</p>
  ),
  notFoundComponent: () => <p className="p-10 text-center text-sm">Nothing here.</p>,
});

function SearchPage() {
  const products = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState<string | null>(null);
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const results = products.filter((p) => {
    const text = `${p.title} ${p.brand}`.toLowerCase();
    return (!brand || p.brandSlug === brand) && words.every((w) => text.includes(w));
  });

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <PageHeader title="Search" />
      <section className="editorial-container py-12 sm:py-16">
        <PageIntro title="Search" eyebrow="Across every label" />
        <div className="relative mx-auto max-w-xl">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.4} />
          <input
            aria-label="Search pieces"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a piece, e.g. black skirt"
            className="h-12 w-full rounded-full border border-input bg-secondary/60 pr-4 pl-11 text-sm focus:border-ring focus:outline-none"
          />
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2">
          {[{ slug: null, name: "All brands" }, ...BRANDS].map((b) => (
            <Button type="button" variant="ghost"
              key={b.slug ?? "all"}
              onClick={() => setBrand(b.slug)}
              className={`label-caps h-auto rounded-none border-b px-1 py-2 hover:bg-transparent ${brand === b.slug ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"}`}
            >
              {b.name}
            </Button>
          ))}
        </div>
        {brand ? (
          <div className="mt-4 text-center">
            <Link
              to="/brands/$slug"
              params={{ slug: brand }}
              className="label-caps text-espresso underline underline-offset-4"
            >
              View {BRANDS.find((b) => b.slug === brand)?.name} page
            </Link>
          </div>
        ) : null}

        <p className="mt-8 mb-6 text-center text-xs text-muted-foreground">
          {results.length} {results.length === 1 ? "piece" : "pieces"}
        </p>
        {results.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">No pieces match “{query}”.</p>
        ) : (
          <div className="editorial-grid pb-16">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
      <BottomNav active="Search" />
    </div>
  );
}
