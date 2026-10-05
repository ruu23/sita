import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { BRANDS } from "./brands";

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) return { allowed: false as const };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    if (error) throw new Error("Couldn't load users");
    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role");

    const users = data.users.map((u) => ({
      id: u.id,
      email: u.email ?? "",
      name: (u.user_metadata?.["full_name"] as string | undefined) ?? "",
      createdAt: u.created_at,
      lastSignIn: u.last_sign_in_at ?? null,
      confirmed: Boolean(u.email_confirmed_at),
      admin: (roles ?? []).some((r) => r.user_id === u.id && r.role === "admin"),
    }));

    const brands = await Promise.all(
      BRANDS.map(async (b) => {
        let count: number | null = null;
        try {
          const res = await fetch(`${b.site}/products.json?limit=250`, {
            headers: { accept: "application/json", "user-agent": "Mozilla/5.0 SitaBot" },
          });
          if (res.ok) count = ((await res.json()) as { products?: unknown[] }).products?.length ?? 0;
        } catch {
          count = null;
        }
        return { slug: b.slug, name: b.name, site: b.site, collections: b.collections.length, products: count, online: count !== null };
      }),
    );

    return { allowed: true as const, users, brands };
  });
