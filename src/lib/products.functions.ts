import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

function catalogConfig() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Brand catalog is unavailable.");
  return { url, key };
}

export const listNewArrivals = createServerFn({ method: "GET" }).handler(async () => {
  const { url, key } = catalogConfig();
  const { fetchCatalog } = await import("./products.server");
  return fetchCatalog(url, key);
});

export const listBrandProducts = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ slug: z.string(), collection: z.string().max(100).optional() }).parse(input))
  .handler(async ({ data }) => {
    const { url, key } = catalogConfig();
    const { fetchBrandCatalog } = await import("./products.server");
    return fetchBrandCatalog(url, key, data.slug, data.collection);
  });

export const listFeaturedProducts = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ slug: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const { url, key } = catalogConfig();
    const { fetchFeaturedCatalog } = await import("./products.server");
    return fetchFeaturedCatalog(url, key, data.slug);
  });
