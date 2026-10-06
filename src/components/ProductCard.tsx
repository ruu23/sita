import { Heart } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/brands";
import { toggleWishlist, useWishlist } from "@/lib/wishlist";

export function ProductCard({ product }: { product: Product }) {
  const wishlist = useWishlist();
  const saved = wishlist.some((p) => p.id === product.id);

  return (
    <div className="group relative bg-card">
      <button
        type="button"
        aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => toggleWishlist(product)}
        className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/85 backdrop-blur"
      >
        <Heart
          className={`h-4 w-4 ${saved ? "fill-foreground text-foreground" : "text-foreground"}`}
          strokeWidth={1.4}
        />
      </button>
      <a href={product.url} target="_blank" rel="noreferrer" className="block">
        <div className="aspect-[3/4] overflow-hidden bg-secondary">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : null}
        </div>
      </a>
      <div className="px-3 py-3">
        <Link
          to="/brands/$slug"
          params={{ slug: product.brandSlug }}
          className="label-caps text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {product.brand}
        </Link>
        <a href={product.url} target="_blank" rel="noreferrer" className="block">
          <p className="mt-1 line-clamp-2 text-sm leading-snug">{product.title}</p>
          {product.price ? (
            <p className="mt-1 text-sm text-espresso">
              {Math.round(Number(product.price))} EGP
            </p>
          ) : null}
        </a>
      </div>
    </div>
  );
}
