import assert from "node:assert/strict";
import { test } from "node:test";
import { BRANDS, mergeEffectiveBrands, type StoredBrandOverride } from "./brands";
import { createStaleCache } from "./product-feed-cache";

function override(slug: string, is_active: boolean, name: string | null = null): StoredBrandOverride {
  return {
    slug,
    name,
    domain: "label.example",
    site: "https://label.example",
    tagline: "Local clothes, thoughtfully made.",
    description: "Local clothes, thoughtfully made.",
    logo: null,
    story: ["Local clothes, thoughtfully made."],
    collections: [],
    socials: [],
    is_active,
  };
}

test("an admin removal hides a built-in brand without changing the other brands", () => {
  const brands = mergeEffectiveBrands([override("naseeji", false)]);
  assert.equal(brands.some((brand) => brand.slug === "naseeji"), false);
  assert.equal(brands.length, BRANDS.length - 1);
  assert.equal(brands.some((brand) => brand.slug === "roaia"), true);
});

test("an active added brand joins the merged catalog", () => {
  const brands = mergeEffectiveBrands([override("new-label", true, "New Label")]);
  const added = brands.find((brand) => brand.slug === "new-label");
  assert.equal(brands.length, BRANDS.length + 1);
  assert.equal(added?.name, "New Label");
  assert.equal(added?.site, "https://label.example");
});

test("a failed refresh serves the last successful product feed", async () => {
  let now = 0;
  const cache = createStaleCache<string[]>({
    freshForMs: 300_000,
    retainForMs: 604_800_000,
    isValid: (value): value is string[] => Array.isArray(value) && value.length > 0,
    now: () => now,
  });

  assert.deepEqual(await cache.getOrLoad("naseeji", async () => ["Gather Top"]), ["Gather Top"]);
  now = 300_001;
  assert.deepEqual(await cache.getOrLoad("naseeji", async () => null), ["Gather Top"]);
});

test("a successful product feed refresh replaces the cached products after five minutes", async () => {
  let now = 0;
  let fetchCount = 0;
  const cache = createStaleCache<string[]>({
    freshForMs: 300_000,
    retainForMs: 604_800_000,
    isValid: (value): value is string[] => Array.isArray(value) && value.length > 0,
    now: () => now,
  });
  const fetchFeed = async () => {
    fetchCount += 1;
    return [fetchCount === 1 ? "Gather Top" : "Ripple Top"];
  };

  assert.deepEqual(await cache.getOrLoad("naseeji", fetchFeed), ["Gather Top"]);
  now = 300_001;
  assert.deepEqual(await cache.getOrLoad("naseeji", fetchFeed), ["Ripple Top"]);
  assert.equal(fetchCount, 2);
});

test("expired product feeds are not served after seven days", async () => {
  let now = 0;
  const cache = createStaleCache<string[]>({
    freshForMs: 300_000,
    retainForMs: 604_800_000,
    isValid: (value): value is string[] => Array.isArray(value) && value.length > 0,
    now: () => now,
  });

  await cache.getOrLoad("naseeji", async () => ["Gather Top"]);
  now = 604_800_001;
  assert.equal(await cache.getOrLoad("naseeji", async () => null), null);
});