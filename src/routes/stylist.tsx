import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { recommendOutfit, type StylistResponse } from "@/lib/stylist.functions";
import { ProductCard } from "@/components/ProductCard";
import { BottomNav } from "@/components/BottomNav";
import { PageHeader } from "@/components/PageHeader";
import { PageIntro } from "@/components/PageIntro";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/stylist")({
  head: () => ({
    meta: [
      { title: "AI Stylist — SITA" },
      { name: "description", content: "Describe an outfit or occasion and get a look built from Egypt's local brands." },
      { property: "og:title", content: "AI Stylist — SITA" },
      { property: "og:description", content: "Tell SITA the occasion; get matching pieces from Egyptian labels." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StylistPage,
});

const IDEAS = [
  { label: "Beach wedding", detail: "El Gouna · sunset", prompt: "Beach wedding in El Gouna" },
  { label: "Gallery opening", detail: "Zamalek · evening", prompt: "Gallery opening night in Zamalek" },
  { label: "Linen layers", detail: "Modest · summer", prompt: "Modest linen layers for summer" },
  { label: "Weekend brunch", detail: "Easy · under 3000 EGP", prompt: "Casual brunch, under 3000 EGP" },
];

function StylistPage() {
  const recommend = useServerFn(recommendOutfit);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StylistResponse | null>(null);

  async function run(text: string) {
    const value = text.trim();
    if (value.length < 3 || loading) return;
    setPrompt(value);
    setLoading(true);
    setResult(null);
    try {
      setResult(await recommend({ data: { prompt: value } }));
    } catch {
      setResult({ ok: false, error: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pb-24 md:pb-10">
      <PageHeader title="Stylist" />
      <main className="editorial-container py-10 sm:py-14">
        <PageIntro title="AI Stylist" eyebrow="The SITA edit">
          A considered look, drawn from Egypt’s local labels.
        </PageIntro>

        <section className="mx-auto grid max-w-6xl gap-12 border-y border-border py-8 sm:py-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(17rem,0.8fr)] lg:gap-20 lg:py-12">
          <div>
            <p className="label-caps text-muted-foreground">01 / Your occasion</p>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl">What are you dressing for?</h2>
            <form
              className="mt-6"
              onSubmit={(e) => {
                e.preventDefault();
                run(prompt);
              }}
            >
              <label htmlFor="stylist-prompt" className="sr-only">Outfit or occasion</label>
              <textarea
                id="stylist-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                maxLength={500}
                rows={4}
                placeholder="Tell us the occasion, mood, weather, or what you’d love to wear…"
                className="min-h-32 w-full resize-y border border-border bg-secondary/40 px-4 py-4 text-sm leading-relaxed outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground sm:px-5"
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">{prompt.length}/500</span>
                <Button
                  disabled={loading || prompt.trim().length < 3}
                  className="h-11 rounded-full px-7 font-display text-base shadow-none"
                >
                  <Sparkles className="h-4 w-4" strokeWidth={1.4} />
                  {loading ? "Putting your look together…" : "Find my look"}
                </Button>
              </div>
            </form>
          </div>

          <div className="lg:border-l lg:border-border lg:pl-10">
            <p className="label-caps text-muted-foreground">02 / Or begin with</p>
            <div className="mt-3 divide-y divide-border border-y border-border">
              {IDEAS.map((idea, index) => (
                <Button
                  variant="ghost"
                  key={idea.label}
                  onClick={() => run(idea.prompt)}
                  disabled={loading}
                  className="group h-auto w-full justify-between rounded-none px-0 py-4 text-left hover:bg-transparent"
                >
                  <span className="flex min-w-0 items-baseline gap-4">
                    <span className="label-caps text-muted-foreground">0{index + 1}</span>
                    <span className="min-w-0">
                      <span className="block font-display text-lg text-foreground">{idea.label}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">{idea.detail}</span>
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.4} />
                </Button>
              ))}
            </div>
          </div>
        </section>

        {loading && (
          <div className="mx-auto mt-12 flex max-w-xl items-center justify-center gap-3 border-y border-border py-5 text-sm text-muted-foreground" role="status" aria-live="polite">
            <Sparkles className="h-4 w-4 animate-pulse text-espresso" strokeWidth={1.4} />
            <span>Finding pieces across Egypt’s local labels…</span>
          </div>
        )}

        {result && !result.ok && (
          <p className="mx-auto mt-12 max-w-md border border-border p-4 text-center text-sm">{result.error}</p>
        )}

        {result?.ok && (
          <section className="mt-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl">{result.title}</h2>
              {result.note && <p className="mt-2 text-sm text-muted-foreground">{result.note}</p>}
            </div>
            <div className="editorial-grid mt-10">
              {result.items.map(({ product, reason }) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                  <p className="mt-2 text-xs italic text-muted-foreground">{reason}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <BottomNav active="Stylist" />
    </div>
  );
}
