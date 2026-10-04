import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { listNewArrivals } from "./products.functions";
import type { Product } from "./brands";

export type StylistResponse =
  | { ok: true; title: string; note: string; items: { product: Product; reason: string }[] }
  | { ok: false; error: string };

export const recommendOutfit = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ prompt: z.string().trim().min(3).max(500) }).parse(d))
  .handler(async ({ data }): Promise<StylistResponse> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { ok: false, error: "The stylist isn't set up yet." };
    const catalog = (await listNewArrivals()) as Product[];
    if (!catalog.length) return { ok: false, error: "Couldn't load the brands' pieces. Try again shortly." };
    try {
      const { recommendFromCatalog } = await import("./stylist.server");
      const r = await recommendFromCatalog(data.prompt, catalog, apiKey);
      const byId = new Map(catalog.map((p) => [p.id, p]));
      const items = r.picks.map((p) => ({ product: byId.get(p.id)!, reason: p.reason }));
      if (!items.length) return { ok: false, error: "No matching pieces found. Try describing it differently." };
      return { ok: true, title: r.title, note: r.note, items };
    } catch (e) {
      const status = (e as { statusCode?: number }).statusCode;
      console.error("stylist error", e);
      if (status === 429) return { ok: false, error: "The stylist is busy. Please try again in a minute." };
      if (status === 402) return { ok: false, error: "AI credits have run out. Please top up to keep using the stylist." };
      return { ok: false, error: "The stylist couldn't put a look together. Please try again." };
    }
  });
