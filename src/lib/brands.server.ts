import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { BRANDS, mergeEffectiveBrands, type Brand } from "./brands";

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

  return mergeEffectiveBrands(data ?? []);
}