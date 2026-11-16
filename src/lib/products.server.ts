import type { Brand, Product } from "./brands";
import { getEffectiveBrands } from "./brands.server";
import { createWorkerStaleCache } from "./product-feed-cache";

type ShopifyProduct = {
  id: number;
  title: string;
  handle: string;
  created_at: string;
  published_at: string | null;
  images?: { src: string }[];
  variants?: { price: string; available?: boolean }[];
};

const productFeedCache = createWorkerStaleCache<Product[]>({
  freshForMs: 5 * 60 * 1000,
  retainForMs: 7 * 24 * 60 * 60 * 1000,
  isValid: (value): value is Product[] =>
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "string" &&
        typeof item.brand === "string" &&
        typeof item.brandSlug === "string" &&
        typeof item.title === "string" &&
        typeof item.price === "string" &&
        (typeof item.image === "string" || item.image === null) &&
        typeof item.url === "string" &&
        typeof item.createdAt === "string",
    ),
});

async function fetchBrand(brand: Brand, limit: number, collection?: string): Promise<Product[]> {
  const path = collection ? `/collections/${encodeURIComponent(collection)}` : "";
  const feedUrl = `${brand.site}${path}/products.json?limit=${limit}`;
  const cacheKey = `${brand.slug}:${feedUrl}`;
  const products = await productFeedCache.getOrLoad(cacheKey, async () => {
    try {
      const response = await fetch(feedUrl, {
        headers: { accept: "application/json", "user-agent": "Mozilla/5.0 SitaBot" },
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) return null;
      const json = (await response.json()) as { products?: ShopifyProduct[] };
      if (!Array.isArray(json.products) || json.products.length === 0) return null;
      return json.products.map((product) => ({
        id: `${brand.slug}-${product.id}`,
        brand: brand.name,
        brandSlug: brand.slug,
        title: product.title,
        price: product.variants?.[0]?.price ?? "",
        image: product.images?.[0]?.src ?? null,
        url: `${brand.site}/products/${product.handle}`,
        createdAt: product.published_at ?? product.created_at,
      }));
    } catch {
      return null;
    }
  });
  return products ?? [];
}

export async function fetchCatalog(url: string, key: string): Promise<Product[]> {
  const brands = await getEffectiveBrands(url, key);
  const batches = await Promise.all(brands.map((brand) => fetchBrand(brand, 30)));
  for (const batch of batches) batch.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const mixed: Product[] = [];
  const longest = Math.max(0, ...batches.map((batch) => batch.length));
  for (let index = 0; index < longest; index++) {
    for (const batch of batches) {
      const item = batch[index];
      if (item) mixed.push(item);
    }
  }
  return mixed.slice(0, 60);
}

export async function fetchBrandCatalog(
  url: string,
  key: string,
  slug: string,
  collection?: string,
): Promise<Product[]> {
  const brands = await getEffectiveBrands(url, key);
  const brand = brands.find((item) => item.slug === slug);
  if (!brand) return [];
  const items = await fetchBrand(brand, 60, collection);
  return items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function fetchFeaturedCatalog(url: string, key: string, slug: string): Promise<Product[]> {
  const brands = await getEffectiveBrands(url, key);
  const brand = brands.find((item) => item.slug === slug);
  if (!brand) return [];
  const batches = await Promise.all(brand.collections.slice(0, 4).map((item) => fetchBrand(brand, 8, item.handle)));
  const picked: Product[] = [];
  const seen = new Set<string>();
  for (const batch of batches) {
    batch.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    const item = batch.find((product) => product.image && !seen.has(product.id));
    if (item) {
      seen.add(item.id);
      picked.push(item);
    }
  }
  return picked.slice(0, 4);
}
