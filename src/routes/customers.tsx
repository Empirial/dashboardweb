import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Plus, Search } from "lucide-react";
import { AppShell, PageIntro, Panel } from "@/components/AppShell";
import { CustomerDialog } from "@/components/WorkshopDialogs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLive } from "@/lib/demo-data";
import { pageMeta } from "@/lib/page-meta";
import { customerCopy } from "@/lib/customer-copy";
import { moduleRecords, nicheConfigs, type ModuleKey, type NicheConfig } from "@/lib/platform-data";
import { useProduct, type Niche } from "@/lib/product";
import { shortDay, useReservations } from "@/lib/reservations";

export const Route = createFileRoute("/customers")({
  head: () =>
    pageMeta(
      "Customers · Empirial POS",
      "Searchable customer profiles and industry-specific history.",
    ),
  component: Customers,
});

type Customer = NicheConfig["customers"][number];

function Customers() {
  const { niche } = useProduct();
  const config = nicheConfigs[niche];
  const { customers: added, records } = useLive();
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [viewing, setViewing] = useState<Customer | null>(null);
  const auto = niche === "automotive";
  const everyone = [...added.filter((customer) => customer.niche === niche), ...config.customers];
  const shown = everyone.filter((customer) =>
    customer.name.toLowerCase().includes(query.toLowerCase()),
  );

  const copy = customerCopy[niche];
  const reservations = useReservations();
  // Where to look for what a customer is currently doing, per industry.
  const currentModule: Partial<Record<Niche, ModuleKey>> = {
    automotive: "jobs",
    beauty: "appointments",
    cleaning: "scheduling",
    food: "floor-plan",
  };
  const currentFor = (customer: Customer): string => {
    if (niche === "hospitality") {
      const surname = customer.name.split(" ").at(-1)?.toLowerCase() ?? "";
      const stay = reservations.find((r) => surname && r.guest.toLowerCase().includes(surname));
      return stay
        ? `Room ${stay.room} · ${shortDay(stay.start)}, ${stay.nights} night${stay.nights === 1 ? "" : "s"}`
        : copy.noCurrent;
    }
    const key = currentModule[niche];
    if (!key) return copy.noCurrent;
    const list = records[key] ?? moduleRecords[key] ?? [];
    const found = list.find((record) =>
      `${record.name} ${record.detail}`.toLowerCase().includes(customer.name.toLowerCase()),
    );
    return found ? `${found.name} · ${found.status}` : copy.noCurrent;
  };

  const rows = (customer: Customer): Array<[string, string]> => [
    [copy.detail, (auto ? customer.vehicle : undefined) ?? customer.detail],
    ["Contact number", customer.phone ?? "Not saved"],
    [copy.notes, customer.problem ?? "Not recorded"],
    [copy.current, currentFor(customer)],
    ["Account", customer.meta],
    ["Lifetime value", customer.value],
  ];

  return (
    <AppShell title="Customers">
      <PageIntro
        title="Customers"
        description={`Client history and account context for ${config.business}.`}
        action={
          <Button onClick={() => setAdding(true)}>
            <Plus />
            Add customer
          </Button>
        }
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
              onClick={() => setViewing(customer)}
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

      <CustomerDialog open={adding} onClose={() => setAdding(false)} niche={niche} />

      <Dialog open={!!viewing} onOpenChange={(next) => !next && setViewing(null)}>
        <DialogContent className="sm:max-w-md">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display">{viewing.name}</DialogTitle>
                <DialogDescription>{viewing.detail}</DialogDescription>
              </DialogHeader>
              <dl className="divide-y divide-border rounded-2xl border border-border bg-secondary text-sm">
                {rows(viewing).map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 px-3 py-2.5">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="text-right font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
              <Button variant="secondary" onClick={() => setViewing(null)}>
                Close
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
