import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";
import { ProductCard } from "@/components/ProductCard";
import { BottomNav } from "@/components/BottomNav";
import { PageHeader } from "@/components/PageHeader";
import { PageIntro } from "@/components/PageIntro";
import { Button } from "@/components/ui/button";

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
      <section className="editorial-container py-12 sm:py-16">
        <PageIntro title="Wishlist" eyebrow="Your edit">{items.length} {items.length === 1 ? "saved piece" : "saved pieces"}</PageIntro>
        {items.length === 0 ? (
          <div className="py-16 text-center">
            <Heart className="mx-auto mb-6 h-9 w-9 text-espresso" strokeWidth={1} />
            <p className="font-display text-2xl">Your edit awaits.</p>
            <Button asChild className="mt-7 h-12 rounded-full px-9 font-display text-base shadow-none"><Link to="/home">
              Browse new in
            </Link></Button>
          </div>
        ) : (
          <div className="editorial-grid pb-16">
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
