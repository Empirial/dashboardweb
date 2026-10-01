import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { AppShell, PageIntro, Panel } from "@/components/AppShell";
import { useLive } from "@/lib/demo-data";
import { pageMeta } from "@/lib/page-meta";
import { nicheConfigs } from "@/lib/platform-data";
import { useProduct } from "@/lib/product";

export const Route = createFileRoute("/customers")({
  head: () =>
    pageMeta(
      "Customers · Empirial POS",
      "Searchable customer profiles and industry-specific history.",
    ),
  component: Customers,
});

function Customers() {
  const { niche } = useProduct();
  const config = nicheConfigs[niche];
  const { customers: added } = useLive();
  const [query, setQuery] = useState("");
  const everyone = [...added.filter((customer) => customer.niche === niche), ...config.customers];
  const shown = everyone.filter((customer) =>
    customer.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <AppShell title="Customers">
      <PageIntro
        title="Customers"
        description={`Client history and account context for ${config.business}.`}
      />
      <Panel>
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search customers"
            className="w-full rounded-[14px] border border-border bg-secondary py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-ring"
          />
        </label>
        <div className="mt-4 divide-y divide-border">
          {shown.map((customer, index) => (
            <button
              key={`${customer.name}-${index}`}
              className="flex w-full items-center gap-3 py-3.5 text-left"
            >
              <span className="grid size-11 place-items-center rounded-2xl border border-border bg-secondary text-xs font-semibold">
                {customer.initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{customer.name}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {customer.detail}
                </span>
                <span className="mt-1 block text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  {customer.meta}
                </span>
              </span>
              <span className="font-display text-xs font-semibold tnum">{customer.value}</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          ))}
          {shown.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No customers match that search.
            </p>
          )}
        </div>
      </Panel>
    </AppShell>
  );
}
