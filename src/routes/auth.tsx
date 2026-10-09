import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import heroAsset from "@/assets/auth-jacket.jpg.asset.json";
import { Button } from "@/components/ui/button";

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setUserEmail(session?.user?.email ?? null),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <main className="relative isolate min-h-svh bg-ink">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src={heroAsset.url}
          alt="Burgundy tailored jacket"
          width={768}
          height={960}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/10 to-transparent" />
      </div>

      <div className="flex min-h-svh justify-center px-7 pb-[10svh] pt-[43svh] sm:px-10">
        <div className="relative w-full max-w-[360px] text-ivory">
          <h1 className="text-center font-display text-xl font-bold uppercase leading-tight sm:text-2xl">
            Find your unique style
          </h1>
          <p className="mt-1 text-center font-display text-base font-medium uppercase text-ivory">
            Let&apos;s get started!
          </p>

          <form
            className="mt-6 space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setNotice(null);
              try {
                if (mode === "signup") {
                  const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { emailRedirectTo: `${window.location.origin}/home` },
                  });
                  if (error) throw error;
                  if (data.session) navigate({ to: "/home" });
                  else setNotice("Check your email to confirm your account, then sign in.");
                } else {
                  const { error } = await supabase.auth.signInWithPassword({ email, password });
                  if (error) throw error;
                  navigate({ to: "/home" });
                }
              } catch (err) {
                setNotice(err instanceof Error ? err.message : "Something went wrong.");
              } finally {
                setBusy(false);
              }
            }}
          >
            <input
              type="email"
              aria-label="Email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="h-11 w-full rounded-xl border border-ivory/20 bg-ivory/45 px-4 text-xs text-ivory outline-none backdrop-blur-md placeholder:text-ivory focus:border-ivory/70 focus:ring-1 focus:ring-ivory/20"
            />
            <input
              type="password"
              aria-label="Password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="h-11 w-full rounded-xl border border-ivory/20 bg-ivory/45 px-4 text-xs text-ivory outline-none backdrop-blur-md placeholder:text-ivory focus:border-ivory/70 focus:ring-1 focus:ring-ivory/20"
            />
            <Button
              type="submit"
              disabled={busy}
              className="mx-auto mt-5 flex h-11 w-3/5 rounded-full bg-ink font-display text-base font-semibold uppercase text-ivory shadow-none hover:bg-ink/85 disabled:opacity-60"
            >
              {busy ? "Please wait…" : mode === "signup" ? "Sign up" : "Sign in"}
            </Button>
            {userEmail ? (
              <p className="pt-2 text-center text-xs text-ivory/80">
                Signed in as {userEmail} ·{" "}
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-xs text-ivory underline underline-offset-4"
                  onClick={() => supabase.auth.signOut()}
                >
                  Sign out
                </Button>
              </p>
            ) : null}
          </form>

          {notice ? (
            <p className="mt-4 text-center text-xs leading-relaxed text-ivory/80">{notice}</p>
          ) : null}

          <p className="mt-7 text-center text-xs text-ivory">
            {mode === "signup" ? "Already have an account?" : "New to Sita?"}{" "}
            <Button
              type="button"
              variant="link"
              onClick={() => {
                setMode(mode === "signup" ? "signin" : "signup");
                setNotice(null);
              }}
              className="h-auto p-0 font-display text-sm font-bold uppercase text-ivory"
            >
              {mode === "signup" ? "Sign in" : "Sign up"}
            </Button>
          </p>

          <p className="mt-6 text-center">
            <Link to="/home" className="text-[10px] text-ivory/75 underline-offset-4 hover:underline">
              Browse without an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}