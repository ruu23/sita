export type Brand = {
  slug: string;
  name: string;
  domain: string;
  site: string;
};

export const BRANDS: Brand[] = [
  { slug: "naseeji", name: "Naseeji", domain: "naseeji.shop", site: "https://naseeji.shop" },
  { slug: "roaia", name: "Roaia Studio", domain: "roaiastudio.com", site: "https://roaiastudio.com" },
  {
    slug: "frenchee",
    name: "Frenchee The Label",
    domain: "frencheethelabel.com",
    site: "https://frencheethelabel.com",
  },
  { slug: "tgs", name: "TGS", domain: "eg.tgsworldwide.com", site: "https://eg.tgsworldwide.com" },
];

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
