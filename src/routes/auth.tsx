import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
    <main className="min-h-screen bg-ink md:grid md:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)]">
      <div className="relative hidden min-h-screen overflow-hidden md:block">
        <img
          src={heroImage}
          alt="Street style in neutral tones"
          width={1024}
          height={1536}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </div>

      <div className="relative flex min-h-screen items-end justify-center overflow-hidden px-6 pb-10 pt-28 sm:px-10 sm:pb-16 md:items-center md:bg-ink md:px-12 md:py-16 lg:px-20">
        <img
          src={heroImage}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center md:hidden"
        />
        <div className="absolute inset-0 bg-ink/45 md:hidden" />
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-ink via-ink/65 to-transparent md:hidden" />

        <div className="relative w-full max-w-md text-ivory">
          <h1 className="text-center font-display text-3xl font-semibold uppercase leading-tight sm:text-4xl lg:text-5xl">
            Find your unique style
          </h1>
          <p className="mt-3 text-center text-xs font-medium uppercase tracking-[0.14em] text-ivory/75">
            Let&apos;s get started!
          </p>

          <form
            className="mt-8 space-y-3 sm:mt-10"
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
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="h-13 w-full rounded-full border border-ivory/30 bg-ivory/15 px-6 text-sm text-ivory outline-none backdrop-blur-md placeholder:text-ivory/70 focus:border-ivory/70 focus:ring-1 focus:ring-ivory/20"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="h-13 w-full rounded-full border border-ivory/30 bg-ivory/15 px-6 text-sm text-ivory outline-none backdrop-blur-md placeholder:text-ivory/70 focus:border-ivory/70 focus:ring-1 focus:ring-ivory/20"
            />
            <button
              type="submit"
              disabled={busy}
              className="h-13 w-full rounded-full bg-ink font-display text-sm font-semibold uppercase text-ivory ring-1 ring-ivory/30 transition-colors hover:bg-ivory hover:text-ink disabled:opacity-60"
            >
              {busy ? "Please wait…" : mode === "signup" ? "Sign up" : "Sign in"}
            </button>
            {userEmail ? (
              <p className="pt-2 text-center text-xs text-ivory/80">
                Signed in as {userEmail} ·{" "}
                <button
                  type="button"
                  className="underline underline-offset-4"
                  onClick={() => supabase.auth.signOut()}
                >
                  Sign out
                </button>
              </p>
            ) : null}
          </form>

          {notice ? (
            <p className="mt-4 text-center text-xs leading-relaxed text-ivory/80">{notice}</p>
          ) : null}

          <p className="mt-7 text-center text-sm text-ivory/75">
            {mode === "signup" ? "Already have an account?" : "New to Sita?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signup" ? "signin" : "signup");
                setNotice(null);
              }}
              className="font-display text-sm font-semibold uppercase text-ivory underline underline-offset-4"
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