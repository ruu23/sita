import type { Product } from "@/lib/brands";

export function ProductCard({ product }: { product: Product }) {
  return (
    <a
      href={product.url}
      target="_blank"
      rel="noreferrer"
      className="group block bg-card"
    >
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
      <div className="px-3 py-3">
        <p className="label-caps text-muted-foreground">{product.brand}</p>
        <p className="mt-1 line-clamp-2 text-sm leading-snug">{product.title}</p>
        {product.price ? (
          <p className="mt-1 text-sm text-espresso">
            {Math.round(Number(product.price))} EGP
          </p>
        ) : null}
      </div>
    </a>
  );
}
