import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import type { Product } from "./brands";

export type StylistPick = { id: string; reason: string };
export type StylistResult = { title: string; note: string; picks: StylistPick[] };

function createRunIdFetch() {
  let runId: string | undefined;
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    if (runId && !headers.has("X-Lovable-AIG-Run-ID")) headers.set("X-Lovable-AIG-Run-ID", runId);
    const res = await fetch(input, { ...init, headers });
    runId ??= res.headers.get("X-Lovable-AIG-Run-ID")?.trim() || undefined;
    return res;
  };
}

export async function recommendFromCatalog(
  prompt: string,
  catalog: Product[],
  apiKey: string,
): Promise<StylistResult> {
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: createRunIdFetch(),
  });

  const list = catalog
    .map((p) => `${p.id} | ${p.brand} | ${p.title} | ${Math.round(Number(p.price) || 0)} EGP`)
    .join("\n");

  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    maxRetries: 0,
    system:
      "You are SITA's stylist for Egyptian local fashion brands. Recommend pieces ONLY from the catalog given (format: id | brand | title | price). " +
      "Build one cohesive look of 3 to 6 pieces, mixing brands when it suits. Respect any budget, modesty or weather cues. " +
      'Reply with JSON only, no markdown: {"title": short look name, "note": 1-2 sentence styling advice, "picks": [{"id": exact catalog id, "reason": under 15 words}]}. ' +
      "Reply in the same language the shopper writes in.",
    prompt: `Shopper request: ${prompt}\n\nCatalog:\n${list}`,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  const text = await result.text;
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("The stylist didn't return a look. Please try again.");
  const parsed = JSON.parse(match[0]) as StylistResult;
  const ids = new Set(catalog.map((p) => p.id));
  return {
    title: String(parsed.title ?? "Your look"),
    note: String(parsed.note ?? ""),
    picks: (parsed.picks ?? []).filter((p) => ids.has(p.id)),
  };
}
