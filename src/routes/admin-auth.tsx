import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { verifyAdminAccess } from "@/lib/brands.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin-auth")({
  head: () => ({
    meta: [
      { title: "SITA Admin Sign In" },
      { name: "description", content: "Secure sign-in for SITA administrators." },
      { property: "og:title", content: "SITA Admin Sign In" },
      { property: "og:description", content: "Secure sign-in for SITA administrators." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminAuthPage,
});

function AdminAuthPage() {
  const navigate = useNavigate();
  const checkAdmin = useServerFn(verifyAdminAccess);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user || !active) return;
      try {
        const result = await checkAdmin();
        if (active && result.allowed) await navigate({ to: "/admin", replace: true });
      } catch {
        // A stale or invalid session stays on the sign-in page.
      }
    });
    return () => {
      active = false;
    };
  }, [checkAdmin, navigate]);

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-5 py-12">
      <section className="w-full max-w-md border-y border-border py-10 sm:py-14">
        <Link to="/home" className="wordmark block text-center text-3xl">SITA</Link>
        <p className="label-caps mt-6 text-center text-muted-foreground">Administration</p>
        <h1 className="mt-3 text-center font-display text-3xl font-semibold">Admin sign in</h1>
        <form
          className="mt-9 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            setNotice(null);
            try {
              const { error } = await supabase.auth.signInWithPassword({ email, password });
              if (error) throw error;
              const access = await checkAdmin();
              if (!access.allowed) {
                await supabase.auth.signOut();
                setNotice("This account does not have administrator access.");
                return;
              }
              await navigate({ to: "/admin", replace: true });
            } catch (error) {
              setNotice(error instanceof Error ? error.message : "Couldn't sign in. Please try again.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <input
            aria-label="Admin email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="h-12 w-full border border-input bg-background px-4 text-sm outline-none focus:border-ring"
          />
          <input
            aria-label="Admin password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="h-12 w-full border border-input bg-background px-4 text-sm outline-none focus:border-ring"
          />
          <Button type="submit" disabled={busy} className="h-12 w-full rounded-full font-display uppercase">
            {busy ? "Checking access…" : "Sign in"}
          </Button>
        </form>
        {notice ? <p role="alert" className="mt-5 text-center text-sm text-destructive">{notice}</p> : null}
        <Link to="/home" className="label-caps mt-8 block text-center text-muted-foreground hover:text-foreground">
          Return to SITA
        </Link>
      </section>
    </main>
  );
}