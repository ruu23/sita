import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SITA — Egyptian local fashion brands in one place" },
      {
        name: "description",
        content:
          "SITA gathers Egypt's local fashion labels in one place. Search a piece once and see it across every brand.",
      },
      { property: "og:title", content: "SITA — Egyptian local fashion brands in one place" },
      {
        property: "og:description",
        content: "Search once, shop every Egyptian local label. New arrivals updated live.",
      },
    ],
  }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/auth" }), 2200);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6">
      <h1 className="wordmark animate-in fade-in text-ivory duration-1000 text-5xl sm:text-6xl md:text-7xl">
        Sita
      </h1>
      <p className="label-caps mt-6 text-center text-ivory/50">
        Egypt&apos;s local labels, one search
      </p>
      <Link to="/auth" className="label-caps mt-14 text-ivory/70 underline-offset-8 hover:underline">
        Enter
      </Link>
    </main>
  );
}
