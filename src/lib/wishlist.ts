import { useEffect, useState } from "react";
import type { Product } from "@/lib/brands";

const KEY = "sita-wishlist";
const EVENT = "sita-wishlist-change";

function read(): Product[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as Product[];
  } catch {
    return [];
  }
}

export function toggleWishlist(product: Product) {
  const list = read();
  const next = list.some((p) => p.id === product.id)
    ? list.filter((p) => p.id !== product.id)
    : [product, ...list];
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
}

export function useWishlist() {
  const [items, setItems] = useState<Product[]>([]);
  useEffect(() => {
    const sync = () => setItems(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return items;
}
