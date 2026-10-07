import { createFileRoute, Link } from "@tanstack/react-router";
import { BRANDS } from "@/lib/brands";
import { BottomNav } from "@/components/BottomNav";
import { PageHeader } from "@/components/PageHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/brands/")({
  head: () => ({
    meta: [
      { title: "The Brands — SITA" },
      { name: "description", content: "Meet the Egyptian local labels on SITA: Naseeji, Roaia Studio, Frenchee The Label and TGS." },
      { property: "og:title", content: "The Brands — SITA" },
      { property: "og:description", content: "Egypt's local fashion labels, gathered in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BrandsPage,
});

function BrandsPage() {
  return (
    <div className="min-h-screen pb-24 md:pb-10">
      <PageHeader title="Brands" />
      <Breadcrumbs items={[{ label: "Home", to: "/home" }, { label: "Brands" }]} />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="text-center">
          <p className="label-caps text-muted-foreground">Seen. Discovered. Chosen.</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">The Brands</h1>
        </div>
        <ul className="mt-10 divide-y divide-border border-y border-border">
          {BRANDS.map((b) => (
            <li key={b.slug}>
              <Link
                to="/brands/$slug"
                params={{ slug: b.slug }}
                className="group flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:gap-8"
              >
                <img
                  src={b.logo}
                  alt={`${b.name} logo`}
                  loading="lazy"
                  className="h-8 w-auto max-w-[140px] shrink-0 object-contain mix-blend-multiply"
                />
                <span className="wordmark text-2xl group-hover:text-espresso sm:text-3xl">{b.name}</span>
                <span className="text-sm text-muted-foreground">{b.tagline}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <BottomNav active="Home" />
    </div>
  );
}
