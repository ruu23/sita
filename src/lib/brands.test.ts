import assert from "node:assert/strict";
import { test } from "node:test";
import { BRANDS, mergeEffectiveBrands, type StoredBrandOverride } from "./brands";

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