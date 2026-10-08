import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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
    <main className="relative isolate min-h-svh overflow-hidden bg-ink">
      <img
        src={heroImage}
        alt="Street style in neutral tones"
        width={1024}
        height={1536}
        fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-ink/25" />

      <div className="flex min-h-svh justify-center px-8 pb-12 pt-[43svh] sm:pb-16 sm:pt-[40svh]">
        <div className="relative w-full max-w-xs text-ivory sm:max-w-sm">
          <h1 className="text-center font-display text-2xl font-bold uppercase sm:text-3xl">
            Find your unique style
          </h1>
          <p className="mt-1 text-center font-display text-lg font-semibold uppercase">Let&apos;s get started!</p>

          <form
            className="mt-6 space-y-3 sm:mt-8"
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
              className="h-12 w-full rounded-xl border border-ivory/20 bg-ivory/65 px-4 text-sm text-ink placeholder:text-ink/60 focus:bg-ivory/85 focus:outline-none focus:ring-2 focus:ring-ivory/60"
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
              className="h-12 w-full rounded-xl border border-ivory/20 bg-ivory/65 px-4 text-sm text-ink placeholder:text-ink/60 focus:bg-ivory/85 focus:outline-none focus:ring-2 focus:ring-ivory/60"
            />
            <Button
              type="submit"
              disabled={busy}
              className="mx-auto mt-5 flex h-11 w-3/5 rounded-full bg-ink font-display text-lg font-bold uppercase text-ivory shadow-none hover:bg-ink/85 focus-visible:ring-ivory disabled:opacity-60"
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
            <p role="status" className="mt-4 text-center text-sm leading-relaxed text-ivory">{notice}</p>
          ) : null}

          <p className="mt-7 text-center text-xs text-ivory sm:text-sm">
            {mode === "signup" ? "Already have an account?" : "New to Sita?"}{" "}
            <Button
              type="button"
              variant="link"
              onClick={() => {
                setMode(mode === "signup" ? "signin" : "signup");
                setNotice(null);
              }}
              className="h-auto p-0 font-display text-sm font-bold uppercase text-ivory underline underline-offset-4"
            >
              {mode === "signup" ? "Sign in" : "Sign up"}
            </Button>
          </p>

          <p className="mt-6 text-center">
            <Link to="/home" className="text-xs text-ivory/85 underline underline-offset-4 hover:text-ivory">
              Browse without an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}