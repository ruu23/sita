import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Heart, LogOut, Mail, Pencil, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { BottomNav } from "@/components/BottomNav";
import { useWishlist } from "@/lib/wishlist";

export const Route = createFileRoute("/me")({
  head: () => ({
    meta: [
      { title: "Your profile — SITA" },
      {
        name: "description",
        content: "Manage your SITA account, name and saved pieces from Egyptian local brands.",
      },
      { property: "og:title", content: "Your profile — SITA" },
      {
        property: "og:description",
        content: "Manage your SITA account and saved pieces.",
      },
    ],
  }),
  component: MePage,
});

function MePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const wishlist = useWishlist();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <main className="min-h-screen bg-background pb-24 md:pb-0">
      <PageHeader title="Me" />

      {loading ? null : user ? (
        <SignedIn user={user} wishlistCount={wishlist.length} />
      ) : (
        <section className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
          <p className="font-display text-3xl">Your Sita profile</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Sign in to manage your account and keep track of the pieces you love from Egypt&apos;s
            local brands.
          </p>
          <Link
            to="/auth"
            className="label-caps mt-8 inline-flex h-12 items-center rounded-full bg-ink px-10 text-ivory transition-colors hover:bg-espresso"
          >
            Sign in
          </Link>
          <Link
            to="/home"
            className="label-caps mt-4 text-muted-foreground underline-offset-4 hover:underline"
          >
            Back to browsing
          </Link>
        </section>
      )}

      <BottomNav active="Me" />
    </main>
  );

  function SignedIn({ user, wishlistCount }: { user: User; wishlistCount: number }) {
    const [name, setName] = useState<string>(
      (user.user_metadata?.full_name as string | undefined) ?? "",
    );
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(name);
    const [saving, setSaving] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);

    const initial = (name || user.email || "S").charAt(0).toUpperCase();
    const memberSince = new Date(user.created_at).toLocaleDateString("en-EG", {
      month: "long",
      year: "numeric",
    });

    async function saveName() {
      setSaving(true);
      setNotice(null);
      const { data, error } = await supabase.auth.updateUser({
        data: { full_name: draft.trim() },
      });
      setSaving(false);
      if (error) {
        setNotice(error.message);
        return;
      }
      setName((data.user?.user_metadata?.full_name as string | undefined) ?? "");
      setEditing(false);
    }

    return (
      <section className="mx-auto max-w-xl px-6 py-12 sm:py-16">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-espresso font-display text-3xl text-ivory">
            {initial}
          </div>

          {editing ? (
            <div className="mt-5 flex w-full max-w-xs items-center gap-2">
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Your name"
                className="h-11 w-full rounded-full border border-border bg-card px-5 text-sm focus:border-foreground focus:outline-none"
              />
              <button
                aria-label="Save name"
                disabled={saving}
                onClick={saveName}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-ivory disabled:opacity-60"
              >
                <Check className="h-4 w-4" strokeWidth={1.6} />
              </button>
              <button
                aria-label="Cancel"
                onClick={() => {
                  setEditing(false);
                  setDraft(name);
                }}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border"
              >
                <X className="h-4 w-4" strokeWidth={1.6} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setDraft(name);
                setEditing(true);
              }}
              className="group mt-5 inline-flex items-center gap-2"
            >
              <span className="font-display text-2xl sm:text-3xl">
                {name || "Add your name"}
              </span>
              <Pencil
                className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground"
                strokeWidth={1.4}
              />
            </button>
          )}

          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" strokeWidth={1.4} />
            {user.email}
          </p>
          <p className="label-caps mt-2 text-muted-foreground">Member since {memberSince}</p>
          {notice ? <p className="mt-3 text-xs text-destructive">{notice}</p> : null}
        </div>

        <div className="mt-12 divide-y divide-border border-y border-border">
          <Link
            to="/wishlist"
            className="flex items-center justify-between py-5 transition-colors hover:text-espresso"
          >
            <span className="flex items-center gap-3 text-sm">
              <Heart className="h-5 w-5" strokeWidth={1.4} />
              My wishlist
            </span>
            <span className="label-caps text-muted-foreground">
              {wishlistCount} {wishlistCount === 1 ? "piece" : "pieces"}
            </span>
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/home" });
            }}
            className="flex w-full items-center gap-3 py-5 text-left text-sm transition-colors hover:text-espresso"
          >
            <LogOut className="h-5 w-5" strokeWidth={1.4} />
            Sign out
          </button>
        </div>
      </section>
    );
  }
}
