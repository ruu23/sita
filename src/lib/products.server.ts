import { BRANDS, type Brand, type Product } from "./brands";
import { getEffectiveBrands } from "./brands.server";

type ShopifyProduct = {
  id: number;
  title: string;
  handle: string;
  created_at: string;
  published_at: string | null;
  images?: { src: string }[];
  variants?: { price: string; available?: boolean }[];
};

async function fetchBrand(brand: Brand, limit: number, collection?: string): Promise<Product[]> {
  try {
    const path = collection ? `/collections/${encodeURIComponent(collection)}` : "";
    const response = await fetch(`${brand.site}${path}/products.json?limit=${limit}`, {
      headers: { accept: "application/json", "user-agent": "Mozilla/5.0 SitaBot" },
    });
    if (!response.ok) return [];
    const json = (await response.json()) as { products?: ShopifyProduct[] };
    return (json.products ?? []).map((product) => ({
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
    return [];
  }
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

export function isBuiltInBrand(slug: string) {
  return BRANDS.some((brand) => brand.slug === slug);
}