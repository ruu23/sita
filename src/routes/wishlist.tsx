import { createFileRoute, Link } from "@tanstack/react-router";
import { useWishlist } from "@/lib/wishlist";
import { ProductCard } from "@/components/ProductCard";
import { BottomNav } from "@/components/BottomNav";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — SITA" },
      { name: "description", content: "The pieces you saved from Egyptian local brands on SITA." },
      { property: "og:title", content: "Wishlist — SITA" },
      { property: "og:description", content: "Your saved pieces on SITA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const items = useWishlist();
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <PageHeader title="Wishlist" />
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="mb-8 text-center text-2xl tracking-[0.18em] uppercase">Wishlist</h1>
        {items.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-muted-foreground">Tap the heart on any piece to save it here.</p>
            <Link to="/home" className="label-caps mt-6 inline-block underline underline-offset-4">
              Browse new in
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 pb-16 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
      <BottomNav active="Wishlist" />
    </div>
  );
}
