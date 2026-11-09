import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { BRANDS, type Brand } from "./brands";

function createPublicClient(url: string, key: string) {
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(
          typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
        );
        if (init?.headers) new Headers(init.headers).forEach((value, name) => headers.set(name, value));
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export async function getEffectiveBrands(url: string, key: string): Promise<Brand[]> {
  const supabase = createPublicClient(url, key);
  const { data, error } = await supabase
    .from("sita_brands")
    .select("slug, name, domain, site, tagline, description, logo, story, collections, socials, is_active")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Couldn't load managed SITA brands", error.message);
    return BRANDS;
  }

  const overrides = new Map((data ?? []).map((row) => [row.slug, row]));
  const builtInSlugs = new Set(BRANDS.map((brand) => brand.slug));
  const builtIns = BRANDS.flatMap((brand) => {
    const override = overrides.get(brand.slug);
    return override?.is_active === false ? [] : [brand];
  });
  const added = (data ?? [])
    .filter((row) => row.is_active && !builtInSlugs.has(row.slug))
    .map((row): Brand => ({
      slug: row.slug,
      name: row.name ?? row.slug,
      domain: row.domain ?? "",
      site: row.site ?? "",
      tagline: row.tagline ?? "",
      description: row.description ?? row.tagline ?? "",
      logo: row.logo ?? "",
      story: row.story ?? [],
      collections: Array.isArray(row.collections) ? row.collections as Brand["collections"] : [],
      socials: Array.isArray(row.socials) ? row.socials as Brand["socials"] : [],
    }));

  return [...builtIns, ...added];
}