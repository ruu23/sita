import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { ArrowUpRight } from "lucide-react";
import { getBrand } from "@/lib/brands";
import { listBrandProducts } from "@/lib/products.functions";
import { ProductCard } from "@/components/ProductCard";
import { BottomNav } from "@/components/BottomNav";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/brands/$slug")({
  validateSearch: z.object({ collection: z.string().optional() }),
  loaderDeps: ({ search }) => ({ collection: search.collection }),
  loader: async ({ params, deps }) => {
    const brand = getBrand(params.slug);
    if (!brand) throw notFound();
    const products = await listBrandProducts({ data: { slug: brand.slug, collection: deps.collection } });
    return { slug: brand.slug, products };
  },
  head: ({ params }) => {
    const brand = getBrand(params.slug);
    const title = brand ? `${brand.name} — SITA` : "Brand not found — SITA";
    const desc = brand ? `${brand.tagline} Shop ${brand.name}'s collections and prices in EGP on SITA.` : "";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: BrandPage,
  notFoundComponent: () => (
    <p className="p-10 text-center text-sm">
      Brand not found. <Link to="/brands" className="underline">See all brands</Link>
    </p>
  ),
  errorComponent: () => (
    <p className="p-10 text-center text-sm text-muted-foreground">Couldn&apos;t load this brand. Please refresh.</p>
  ),
});

function BrandPage() {
  const { slug, products } = Route.useLoaderData();
  const { collection } = Route.useSearch();
  const brand = getBrand(slug)!;
  const prices = products.map((p) => Number(p.price)).filter((n) => n > 0);
  const range = prices.length ? `${Math.round(Math.min(...prices))} – ${Math.round(Math.max(...prices))} EGP` : null;

  return (
    <div className="min-h-screen pb-24 md:pb-10">
      <PageHeader title="Brands" />
      <section className="bg-ink px-4 py-14 text-center text-ivory sm:py-20">
        <p className="label-caps opacity-70">Egyptian local label</p>
        <h1 className="wordmark mt-4 text-4xl sm:text-6xl">{brand.name}</h1>
        <p className="mx-auto mt-4 max-w-xl font-display text-xl italic opacity-90">{brand.tagline}</p>
      </section>

      <main className="mx-auto max-w-7xl px-4 sm:px-6">
        <section className="grid gap-10 border-b border-border py-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="label-caps text-muted-foreground">The story</h2>
            {brand.story.map((p) => (
              <p key={p} className="mt-4 font-display text-xl leading-relaxed sm:text-2xl">{p}</p>
            ))}
          </div>
          <div className="space-y-6 text-sm">
            {range && (
              <div>
                <h2 className="label-caps text-muted-foreground">Price range</h2>
                <p className="mt-2 text-espresso">{range}</p>
              </div>
            )}
            <div>
              <h2 className="label-caps text-muted-foreground">Find them</h2>
              <ul className="mt-2 space-y-2">
                {brand.socials.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
                      {s.label} <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.4} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-10">
          <h2 className="text-center text-2xl tracking-[0.18em] uppercase">Collections</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link
              to="/brands/$slug"
              params={{ slug }}
              search={{}}
              className={`label-caps border px-4 py-2 ${!collection ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"}`}
            >
              All pieces
            </Link>
            {brand.collections.map((c) => (
              <Link
                key={c.handle}
                to="/brands/$slug"
                params={{ slug }}
                search={{ collection: c.handle }}
                className={`label-caps border px-4 py-2 ${collection === c.handle ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                {c.title}
              </Link>
            ))}
          </div>
          <p className="mt-8 mb-6 text-center text-xs text-muted-foreground">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>
          {products.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">No pieces in this collection right now.</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </main>
      <BottomNav active="Home" />
    </div>
  );
}
