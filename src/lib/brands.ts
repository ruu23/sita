export type BrandCollection = { handle: string; title: string };
export type BrandSocial = { label: string; url: string };

export type Brand = {
  slug: string;
  name: string;
  domain: string;
  site: string;
  tagline: string;
  description: string;
  logo: string;
  story: string[];
  collections: BrandCollection[];
  socials: BrandSocial[];
};

export const BRANDS: Brand[] = [
  {
    slug: "naseeji",
    name: "Naseeji",
    domain: "naseeji.shop",
    site: "https://naseeji.shop",
    tagline: "Easy, draped pieces for everyday Cairo.",
    description:
      "Naseeji — from the Arabic for “my fabric” — makes relaxed, flowing pieces: coordinated sets, kimonos and kaftans, and soft tops built for Egyptian summers.",
    logo: "https://naseeji.shop/cdn/shop/files/Untitled_design.png?v=1763671526&width=400",
    story: [
      "Naseeji — from the Arabic for “my fabric” — designs relaxed, flowing pieces built around comfort and modest silhouettes.",
      "Think coordinated sets, kimonos and kaftans, and soft tops made to layer through Egyptian summers and mild winters.",
    ],
    collections: [
      { handle: "summer-26", title: "Summer Drop 0.2" },
      { handle: "sets", title: "Sets" },
      { handle: "kimonos-kaftans", title: "Kimonos & Kaftans" },
      { handle: "tops-kimonos", title: "Tops & Shirts" },
      { handle: "bottoms", title: "Bottoms" },
      { handle: "denim", title: "Denim" },
    ],
    socials: [{ label: "Website", url: "https://naseeji.shop" }],
  },
  {
    slug: "roaia",
    name: "Roaia Studio",
    domain: "roaiastudio.com",
    site: "https://roaiastudio.com",
    tagline: "Linen, kimonos and quiet layers.",
    description:
      "Roaia — “vision” in Arabic — is a studio built on breathable linen: airy kimonos, considered layers, and bags and accessories to finish them.",
    logo: "https://roaiastudio.com/cdn/shop/files/Untitled_design_3.png?v=1707667894&width=600&height=150&crop=center",
    story: [
      "Roaia — “vision” in Arabic — is a studio known for breathable linen, statement kimonos and considered layering.",
      "Its collections move from airy summer linen to soft cardigans and coats for the cooler months, finished with bags and accessories.",
    ],
    collections: [
      { handle: "new-arrivals", title: "New Arrivals" },
      { handle: "linen-lovers", title: "Linen Lovers" },
      { handle: "kimonos", title: "Kimonos" },
      { handle: "sets", title: "Sets" },
      { handle: "coats", title: "F/W Coats" },
      { handle: "accessories", title: "Accessories" },
    ],
    socials: [{ label: "Website", url: "https://roaiastudio.com" }],
  },
  {
    slug: "frenchee",
    name: "Frenchee The Label",
    domain: "frencheethelabel.com",
    site: "https://frencheethelabel.com",
    tagline: "Denim and easy linen with a French accent.",
    description:
      "Frenchee The Label brings a relaxed, Parisian-inspired attitude to everyday dressing — denim cuts, comfy sets and linen pieces that work from morning coffee to evening plans.",
    logo: "https://frencheethelabel.com/cdn/shop/files/Frenchee_Logo_47f8446b-7a24-42fb-a173-3628c86daee9.png?v=1750848953&width=400",
    story: [
      "Frenchee The Label brings a relaxed, Parisian-inspired attitude to everyday dressing.",
      "The label focuses on denim cuts, comfy sets and linen pieces that work from morning coffee to evening plans.",
    ],
    collections: [
      { handle: "new-collection", title: "New Collection" },
      { handle: "summer-collection", title: "Summer Collection" },
      { handle: "denim", title: "Pants" },
      { handle: "demi-cercle-tops", title: "Tops" },
      { handle: "jackets-1", title: "Jackets" },
      { handle: "sets", title: "Sets" },
    ],
    socials: [{ label: "Website", url: "https://frencheethelabel.com" }],
  },
  {
    slug: "tgs",
    name: "TGS",
    domain: "eg.tgsworldwide.com",
    site: "https://eg.tgsworldwide.com",
    tagline: "Trend-led footwear and wardrobe staples.",
    description:
      "TGS Worldwide is an Egyptian footwear house — heels, flats, bags, basics and athleisure in hundreds of styles and colours, made to slip into any wardrobe.",
    logo: "https://eg.tgsworldwide.com/cdn/shop/files/logowhitebg.jpg?v=1777381922&width=800&height=220&crop=center",
    story: [
      "TGS Worldwide has been a leading footwear innovator in Egypt and the Middle East, offering fashionable, high-quality shoes while staying accessible.",
      "Today it carries hundreds of styles and colours — from heels and flats to bags, basics and athleisure — to fit into any wardrobe.",
    ],
    collections: [
      { handle: "footwear", title: "Footwear" },
      { handle: "heels", title: "Heels" },
      { handle: "flats", title: "Flats" },
      { handle: "bags", title: "Bags" },
      { handle: "basics-women", title: "Basics — Women" },
      { handle: "athleisurewomen", title: "Athleisure" },
    ],
    socials: [
      { label: "Instagram", url: "https://www.instagram.com/tgs_worldwide" },
      { label: "Facebook", url: "https://www.facebook.com/tgsworldwide.me" },
      { label: "Website", url: "https://eg.tgsworldwide.com" },
    ],
  },
];

export function getBrand(slug: string) {
  return BRANDS.find((b) => b.slug === slug);
}

export type Product = {
  id: string;
  brand: string;
  brandSlug: string;
  title: string;
  price: string;
  image: string | null;
  url: string;
  createdAt: string;
};
