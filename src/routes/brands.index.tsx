import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { BRANDS } from "@/lib/brands";
import { BottomNav } from "@/components/BottomNav";
import { PageHeader } from "@/components/PageHeader";
import { PageIntro } from "@/components/PageIntro";
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
      <main className="editorial-container py-12 sm:py-16">
        <PageIntro title="The Brands" eyebrow="Seen. Discovered. Chosen." />
        <ul className="mt-10 divide-y divide-border border-y border-border">
          {BRANDS.map((b) => (
            <li key={b.slug}>
              <Link
                to="/brands/$slug"
                params={{ slug: b.slug }}
                className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-5 py-8 sm:py-10 md:grid-cols-[160px_minmax(0,1fr)_auto]"
              >
                <img
                  src={b.logo}
                  alt={`${b.name} logo`}
                  loading="lazy"
                  className="col-span-2 h-10 w-auto max-w-[150px] object-contain mix-blend-multiply md:col-span-1"
                />
                <span className="min-w-0"><span className="block font-display text-2xl font-semibold transition-colors group-hover:text-espresso sm:text-3xl">{b.name}</span><span className="mt-2 block text-xs leading-relaxed text-muted-foreground sm:text-sm">{b.tagline}</span></span>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-espresso" strokeWidth={1.2} />
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <BottomNav active="Home" />
    </div>
  );
}
