import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getAdminOverview } from "@/lib/admin.functions";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — SITA" },
      { name: "description", content: "SITA admin: shoppers and partner brands." },
      { property: "og:title", content: "Admin — SITA" },
      { property: "og:description", content: "SITA admin dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const fmt = (d: string | null) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—");

function AdminPage() {
  const fetchOverview = useServerFn(getAdminOverview);
  const { data, isLoading, error } = useQuery({ queryKey: ["admin"], queryFn: () => fetchOverview(), retry: false });

  return (
    <div className="min-h-screen pb-10">
      <PageHeader title="Admin" />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {isLoading && <p className="text-center text-sm text-muted-foreground">Loading…</p>}
        {error && (
          <p className="text-center text-sm">
            Please <Link to="/auth" className="underline">sign in</Link> with an admin account.
          </p>
        )}
        {data && !data.allowed && <p className="text-center text-sm">This page is for SITA admins only.</p>}
        {data?.allowed && (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Stat label="Shoppers" value={data.users.length} />
              <Stat label="Confirmed" value={data.users.filter((u) => u.confirmed).length} />
              <Stat label="Brands" value={data.brands.length} />
              <Stat label="Live pieces" value={data.brands.reduce((n, b) => n + (b.products ?? 0), 0)} />
            </div>

            <h2 className="mt-12 text-2xl tracking-[0.18em] uppercase">Brands</h2>
            <div className="mt-4 overflow-x-auto border border-border bg-card">
              <table className="w-full text-left text-sm">
                <thead className="label-caps text-muted-foreground">
                  <tr><th className="p-3">Brand</th><th className="p-3">Store</th><th className="p-3">Pieces</th><th className="p-3">Collections</th><th className="p-3">Status</th></tr>
                </thead>
                <tbody>
                  {data.brands.map((b) => (
                    <tr key={b.slug} className="border-t border-border">
                      <td className="p-3"><Link to="/brands/$slug" params={{ slug: b.slug }} className="hover:underline">{b.name}</Link></td>
                      <td className="p-3"><a href={b.site} target="_blank" rel="noreferrer" className="text-muted-foreground hover:underline">{b.site.replace("https://", "")}</a></td>
                      <td className="p-3">{b.products ?? "—"}</td>
                      <td className="p-3">{b.collections}</td>
                      <td className="p-3">{b.online ? "Online" : <span className="text-destructive">Unreachable</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="mt-12 text-2xl tracking-[0.18em] uppercase">Shoppers</h2>
            <div className="mt-4 overflow-x-auto border border-border bg-card">
              <table className="w-full text-left text-sm">
                <thead className="label-caps text-muted-foreground">
                  <tr><th className="p-3">Email</th><th className="p-3">Name</th><th className="p-3">Joined</th><th className="p-3">Last sign-in</th><th className="p-3">Status</th></tr>
                </thead>
                <tbody>
                  {data.users.map((u) => (
                    <tr key={u.id} className="border-t border-border">
                      <td className="p-3">{u.email}{u.admin && <span className="label-caps ml-2 text-espresso">Admin</span>}</td>
                      <td className="p-3">{u.name || "—"}</td>
                      <td className="p-3">{fmt(u.createdAt)}</td>
                      <td className="p-3">{fmt(u.lastSignIn)}</td>
                      <td className="p-3">{u.confirmed ? "Confirmed" : "Awaiting email"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border bg-card p-5">
      <p className="label-caps text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-4xl">{value}</p>
    </div>
  );
}
