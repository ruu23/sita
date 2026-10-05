import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { BRANDS, type Product } from "./brands";

type ShopifyProduct = {
  id: number;
  title: string;
  handle: string;
  created_at: string;
  published_at: string | null;
  images?: { src: string }[];
  variants?: { price: string; available?: boolean }[];
};

async function fetchBrand(
  brand: (typeof BRANDS)[number],
  limit: number,
  collection?: string,
): Promise<Product[]> {
  try {
    const path = collection ? `/collections/${encodeURIComponent(collection)}` : "";
    const res = await fetch(`${brand.site}${path}/products.json?limit=${limit}`, {
      headers: { accept: "application/json", "user-agent": "Mozilla/5.0 SitaBot" },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { products?: ShopifyProduct[] };
    return (json.products ?? []).map((p) => ({
      id: `${brand.slug}-${p.id}`,
      brand: brand.name,
      brandSlug: brand.slug,
      title: p.title,
      price: p.variants?.[0]?.price ?? "",
      image: p.images?.[0]?.src ?? null,
      url: `${brand.site}/products/${p.handle}`,
      createdAt: p.published_at ?? p.created_at,
    }));
  } catch {
    return [];
  }
}

export async function fetchCatalog(): Promise<Product[]> {
  const batches = await Promise.all(BRANDS.map((b) => fetchBrand(b, 30)));
  for (const batch of batches) {
    batch.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }
  // Round-robin so every brand shows up near the top of the feed.
  const mixed: Product[] = [];
  const longest = Math.max(0, ...batches.map((b) => b.length));
  for (let i = 0; i < longest; i++) {
    for (const batch of batches) {
      const item = batch[i];
      if (item) mixed.push(item);
    }
  }
  return mixed.slice(0, 60);
}

export const listNewArrivals = createServerFn({ method: "GET" }).handler(() => fetchCatalog());

export const listBrandProducts = createServerFn({ method: "GET" })
  .inputValidator((d) =>
    z.object({ slug: z.string(), collection: z.string().max(100).optional() }).parse(d),
  )
  .handler(async ({ data }) => {
    const brand = BRANDS.find((b) => b.slug === data.slug);
    if (!brand) return [];
    const items = await fetchBrand(brand, 60, data.collection);
    return items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  });
