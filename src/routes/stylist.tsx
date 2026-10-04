import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { recommendOutfit, type StylistResponse } from "@/lib/stylist.functions";
import { ProductCard } from "@/components/ProductCard";
import { BottomNav } from "@/components/BottomNav";
import { PageHeader } from "@/components/PageHeader";

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
  "Beach wedding in El Gouna",
  "Gallery opening night in Zamalek",
  "Modest linen layers for summer",
  "Casual brunch, under 3000 EGP",
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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <section className="mx-auto max-w-2xl text-center">
          <p className="label-caps text-muted-foreground">AI Stylist</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">Describe the moment.</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Tell us the occasion, mood or budget — we'll build a look from Egypt's local labels.
          </p>
          <form
            className="mt-6 flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              run(prompt);
            }}
          >
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              maxLength={500}
              placeholder="e.g. Engagement party, elegant but comfortable"
              className="flex-1 border border-border bg-card px-4 py-3 text-sm outline-none focus:border-foreground"
            />
            <button
              disabled={loading || prompt.trim().length < 3}
              className="label-caps inline-flex items-center justify-center gap-2 bg-primary px-6 py-3 text-primary-foreground disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" strokeWidth={1.4} />
              {loading ? "Styling…" : "Style me"}
            </button>
          </form>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {IDEAS.map((i) => (
              <button
                key={i}
                onClick={() => run(i)}
                disabled={loading}
                className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-foreground hover:text-foreground disabled:opacity-50"
              >
                {i}
              </button>
            ))}
          </div>
        </section>

        {loading && (
          <p className="mt-12 text-center text-sm text-muted-foreground">
            Browsing Naseeji, Roaia, Frenchee and TGS for you…
          </p>
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
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
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
