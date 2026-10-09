import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getAdminOverview } from "@/lib/admin.functions";
import { PageHeader } from "@/components/PageHeader";
import { PageIntro } from "@/components/PageIntro";

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

  const [bq, setBq] = useState("");
  const [bStatus, setBStatus] = useState("all");
  const [uq, setUq] = useState("");
  const [uStatus, setUStatus] = useState("all");
  const brands = (data?.brands ?? []).filter((b) =>
    (`${b.name} ${b.site}`.toLowerCase().includes(bq.trim().toLowerCase())) &&
    (bStatus === "all" || (bStatus === "online" ? b.online : !b.online)));
  const users = (data?.users ?? []).filter((u) =>
    (`${u.email ?? ""} ${u.name ?? ""}`.toLowerCase().includes(uq.trim().toLowerCase())) &&
    (uStatus === "all" || (uStatus === "confirmed" ? u.confirmed : uStatus === "pending" ? !u.confirmed : u.admin)));
  const inputCls = "h-11 min-w-0 rounded-md border border-border bg-secondary/50 px-3 text-sm outline-none focus:border-foreground";

  return (
    <div className="min-h-screen pb-10">
      <PageHeader title="Admin" />
      <main className="editorial-container py-12 sm:py-16">
        <PageIntro title="Administration" eyebrow="SITA workspace" />
        {isLoading && <p className="text-center text-sm text-muted-foreground">Loading…</p>}
        {error && (
          <p className="text-center text-sm">
            Please <Link to="/auth" className="underline">sign in</Link> with an admin account.
          </p>
        )}
        {data && !data.allowed && <p className="text-center text-sm">This page is for SITA admins only.</p>}
        {data?.allowed && (
          <>
            <div className="grid grid-cols-2 divide-x divide-border border-y border-border md:grid-cols-4">
              <Stat label="Shoppers" value={data.users.length} />
              <Stat label="Confirmed" value={data.users.filter((u) => u.confirmed).length} />
              <Stat label="Brands" value={data.brands.length} />
              <Stat label="Live pieces" value={data.brands.reduce((n, b) => n + (b.products ?? 0), 0)} />
            </div>

            <h2 className="mt-12 font-display text-2xl font-semibold sm:text-3xl">Brands</h2>
            <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] gap-3 sm:flex sm:items-center">
              <input aria-label="Search brands" value={bq} onChange={(e) => setBq(e.target.value)} placeholder="Search brands…" className={`${inputCls} min-w-0 flex-1 sm:max-w-xs`} />
              <select aria-label="Brand status" value={bStatus} onChange={(e) => setBStatus(e.target.value)} className={inputCls}>
                <option value="all">All statuses</option><option value="online">Online</option><option value="offline">Unreachable</option>
              </select>
              <span className="col-span-2 self-center text-xs text-muted-foreground">{brands.length} of {data.brands.length}</span>
            </div>
            <div className="mt-5 overflow-x-auto border-y border-border bg-background">
              <table className="w-full min-w-[640px] text-left text-xs sm:text-sm">
                <thead className="label-caps bg-secondary/60 text-muted-foreground">
                  <tr><th className="px-4 py-4">Brand</th><th className="px-4 py-4">Store</th><th className="px-4 py-4">Pieces</th><th className="px-4 py-4">Collections</th><th className="px-4 py-4">Status</th></tr>
                </thead>
                <tbody>
                  {brands.map((b) => (
                    <tr key={b.slug} className="border-t border-border">
                      <td className="px-4 py-4"><Link to="/brands/$slug" params={{ slug: b.slug }} className="hover:underline">{b.name}</Link></td>
                      <td className="px-4 py-4"><a href={b.site} target="_blank" rel="noreferrer" className="text-muted-foreground hover:underline">{b.site.replace("https://", "")}</a></td>
                      <td className="px-4 py-4">{b.products ?? "—"}</td>
                      <td className="px-4 py-4">{b.collections}</td>
                      <td className="px-4 py-4">{b.online ? "Online" : <span className="text-destructive">Unreachable</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="mt-12 font-display text-2xl font-semibold sm:text-3xl">Shoppers</h2>
            <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] gap-3 sm:flex sm:items-center">
              <input aria-label="Search shoppers" value={uq} onChange={(e) => setUq(e.target.value)} placeholder="Search by email or name…" className={`${inputCls} min-w-0 flex-1 sm:max-w-xs`} />
              <select aria-label="Shopper status" value={uStatus} onChange={(e) => setUStatus(e.target.value)} className={inputCls}>
                <option value="all">All shoppers</option><option value="confirmed">Confirmed</option><option value="pending">Awaiting email</option><option value="admin">Admins</option>
              </select>
              <span className="col-span-2 self-center text-xs text-muted-foreground">{users.length} of {data.users.length}</span>
            </div>
            <div className="mt-5 overflow-x-auto border-y border-border bg-background">
              <table className="w-full min-w-[640px] text-left text-xs sm:text-sm">
                <thead className="label-caps bg-secondary/60 text-muted-foreground">
                  <tr><th className="px-4 py-4">Email</th><th className="px-4 py-4">Name</th><th className="px-4 py-4">Joined</th><th className="px-4 py-4">Last sign-in</th><th className="px-4 py-4">Status</th></tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t border-border">
                      <td className="px-4 py-4">{u.email}{u.admin && <span className="label-caps ml-2 text-espresso">Admin</span>}</td>
                      <td className="px-4 py-4">{u.name || "—"}</td>
                      <td className="px-4 py-4">{fmt(u.createdAt)}</td>
                      <td className="px-4 py-4">{fmt(u.lastSignIn)}</td>
                      <td className="px-4 py-4">{u.confirmed ? "Confirmed" : "Awaiting email"}</td>
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
    <div className="min-w-0 px-4 py-6 sm:px-6">
      <p className="label-caps bg-secondary/60 text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-4xl">{value}</p>
    </div>
  );
}
