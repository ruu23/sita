import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { BRANDS } from "./brands";

const brandInput = z.object({
  name: z.string().trim().min(2).max(80),
  site: z.string().trim().url().max(300),
  tagline: z.string().trim().min(3).max(180),
  logo: z.string().trim().max(500).optional().or(z.literal("")),
});

function parseStoreSite(value: string) {
  const parsed = new URL(value);
  const host = parsed.hostname.toLowerCase();
  if (
    parsed.protocol !== "https:" ||
    !host.includes(".") ||
    host === "localhost" ||
    host.endsWith(".local") ||
    /^\d{1,3}(\.\d{1,3}){3}$/.test(host) ||
    parsed.username ||
    parsed.password
  ) {
    throw new Error("Enter a public store website starting with https://.");
  }
  return parsed;
}

export const listBrands = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Brand catalog is unavailable.");
  const { getEffectiveBrands } = await import("./brands.server");
  return getEffectiveBrands(url, key);
});

export const verifyAdminAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error) throw new Error("Couldn't verify admin access.");
    return { allowed: data === true };
  });

export const addManagedBrand = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => brandInput.parse(input))
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleError || !isAdmin) throw new Error("Only SITA admins can add brands.");

    const parsedSite = parseStoreSite(data.site);
    const slug = data.name
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60);
    if (!slug || BRANDS.some((brand) => brand.slug === slug)) {
      throw new Error("That brand name is already in the SITA catalog.");
    }
    const { data: existing } = await context.supabase
      .from("sita_brands")
      .select("slug")
      .eq("slug", slug)
      .maybeSingle();
    if (existing) throw new Error("That brand name is already in the SITA catalog.");

    const { error } = await context.supabase.from("sita_brands").insert({
      slug,
      name: data.name,
      domain: parsedSite.hostname,
      site: parsedSite.origin,
      tagline: data.tagline,
      description: data.tagline,
      logo: data.logo || null,
      story: [data.tagline],
      collections: [],
      socials: [{ label: "Website", url: parsedSite.origin }],
      is_active: true,
    });
    if (error) throw new Error("Couldn't add this brand. Check the website and try again.");
    return { ok: true as const, slug };
  });

export const removeManagedBrand = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ slug: z.string().min(1).max(80) }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleError || !isAdmin) throw new Error("Only SITA admins can remove brands.");

    if (BRANDS.some((brand) => brand.slug === data.slug)) {
      const { error } = await context.supabase.from("sita_brands").upsert({
        slug: data.slug,
        is_active: false,
      });
      if (error) throw new Error("Couldn't remove this brand. Please try again.");
    } else {
      const { error } = await context.supabase.from("sita_brands").delete().eq("slug", data.slug);
      if (error) throw new Error("Couldn't remove this brand. Please try again.");
    }
    return { ok: true as const };
  });