import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import heroImage from "@/assets/auth-hero.jpg";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Join SITA — find your unique style" },
      {
        name: "description",
        content: "Create your SITA account to follow Egyptian local fashion brands and save pieces you love.",
      },
      { property: "og:title", content: "Join SITA — find your unique style" },
      {
        property: "og:description",
        content: "Create your SITA account to follow Egyptian local fashion brands.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-ink md:grid md:grid-cols-2">
      <div className="relative hidden md:block">
        <img
          src={heroImage}
          alt="Street style in neutral tones"
          width={1024}
          height={1536}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
        <img
          src={heroImage}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover md:hidden"
        />
        <div className="absolute inset-0 bg-ink/55 md:hidden" />

        <div className="relative w-full max-w-sm text-ivory">
          <h1 className="text-center font-display text-3xl tracking-wide sm:text-4xl">
            Find your unique style
          </h1>
          <p className="mt-2 text-center text-sm text-ivory/70">Let&apos;s get started!</p>

          <form
            className="mt-10 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setNotice(
                "Accounts switch on as soon as the database is connected — your details aren't saved yet.",
              );
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="h-12 w-full rounded-full border border-ivory/25 bg-ivory/10 px-5 text-sm text-ivory placeholder:text-ivory/60 focus:border-ivory/60 focus:outline-none"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="h-12 w-full rounded-full border border-ivory/25 bg-ivory/10 px-5 text-sm text-ivory placeholder:text-ivory/60 focus:border-ivory/60 focus:outline-none"
            />
            <button
              type="submit"
              className="label-caps h-12 w-full rounded-full bg-ink text-ivory ring-1 ring-ivory/30 transition-colors hover:bg-ivory hover:text-ink"
            >
              {mode === "signup" ? "Sign up" : "Sign in"}
            </button>
          </form>

          {notice ? (
            <p className="mt-4 text-center text-xs leading-relaxed text-ivory/80">{notice}</p>
          ) : null}

          <p className="mt-8 text-center text-sm text-ivory/75">
            {mode === "signup" ? "Already have an account?" : "New to Sita?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signup" ? "signin" : "signup");
                setNotice(null);
              }}
              className="label-caps text-ivory underline underline-offset-4"
            >
              {mode === "signup" ? "Sign in" : "Sign up"}
            </button>
          </p>

          <p className="mt-10 text-center">
            <Link to="/home" className="label-caps text-ivory/60 underline-offset-8 hover:underline">
              Browse without an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
