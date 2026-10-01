import { useMemo, useState } from "react";
import { Check, ChevronRight, Plus, RotateCw, Search } from "lucide-react";
import { AppShell, PageIntro, Panel, Segmented, Stat } from "./AppShell";
import { MonthCalendar } from "./MonthCalendar";
import { JobDialog, ModuleFormDialog, PartDialog, QuoteDialog } from "./WorkshopDialogs";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { moduleRecords, type ModuleKey, type ModuleRecord } from "@/lib/platform-data";
import {
  jobStatuses,
  numberIn,
  quoteStatuses,
  recordSale,
  setModuleRecords,
  useLive,
} from "@/lib/demo-data";
import { rand } from "@/lib/hotel-data";
import { moduleForms } from "@/lib/module-forms";
import { useProduct } from "@/lib/product";
import { TODAY, addDays, shortDay } from "@/lib/reservations";
import { nicheConfigs } from "@/lib/platform-data";

const titles: Record<ModuleKey, [string, string]> = {
  rooms: ["Room board", "Manage live room condition and 30-day availability."],
  bookings: ["Bookings", "Track reservations, arrival status, and folios."],
  "floor-plan": ["Floor plan", "Open tables, return to live checks, and track dining progress."],
  kitchen: ["Kitchen display", "Move tickets from queue through cooking to ready."],
  inventory: ["Inventory", "Monitor stock, thresholds, and incoming replenishment."],
  catalog: ["Product catalog", "Manage products, variants, pricing, and barcodes."],
  appointments: ["Appointments", "Manage the studio calendar and book available time."],
  staff: ["Studio staff", "Review specialties, schedules, and today's availability."],
  packages: ["Packages", "Bundle services and send packages directly to the register."],
  jobs: ["Job cards", "Track workshop progress, labor, parts, and collection."],
  parts: ["Parts", "Manage workshop stock, customer parts, suppliers, and reorder levels."],
  quotes: ["Quotes", "Build estimates, track approval and record payment."],
  scheduling: ["Job schedule", "Coordinate recurring and one-off property visits."],
  billing: ["Recurring billing", "Preview and process the next client billing batch."],
  crew: ["Crew", "Balance availability and daily field assignments."],
};

const calendarModules: ModuleKey[] = ["appointments", "scheduling", "jobs"];
const searchable: ModuleKey[] = ["parts", "jobs", "quotes", "inventory", "catalog"];
const newLabels: Partial<Record<ModuleKey, string>> = {
  jobs: "New job",
  quotes: "New quote",
  parts: "Add part",
};
// Spreads the sample records over the next two weeks so the calendar looks lived-in.
const SEED_OFFSETS = [0, 0, 1, 2, 4, 5, 8, 11];

// Statuses a record can be moved between from its pop-up.
const statusSets: Partial<Record<ModuleKey, readonly string[]>> = {
  jobs: jobStatuses,
  quotes: quoteStatuses,
  appointments: ["Confirmed", "In service", "Completed", "No-show"],
  "floor-plan": ["Empty", "Reserved", "Seated", "Ordered", "Awaiting payment"],
  kitchen: ["Queued", "Cooking", "Ready", "Served"],
  scheduling: ["Scheduled", "In progress", "Completed"],
  billing: ["Upcoming", "Due", "Paid"],
};

type Kpi = { label: string; value: string | number; sub: string };

const sumOf = (list: ModuleRecord[]) =>
  list.reduce((total, record) => total + numberIn(record.value), 0);
const count = (list: ModuleRecord[], pattern: RegExp) =>
  list.filter((record) => pattern.test(record.status)).length;

/** KPIs that fit what each page is about, instead of one generic set. */
function kpisFor(moduleKey: ModuleKey, records: ModuleRecord[]): Kpi[] {
  if (moduleKey === "jobs") {
    const open = records.filter((record) => !/complete|collected/i.test(record.status));
    return [
      { label: "Open jobs", value: open.length, sub: "Not yet completed" },
      { label: "In progress", value: count(records, /progress/i), sub: "On the workshop floor" },
      { label: "Ready", value: count(records, /ready/i), sub: "Waiting for collection" },
      { label: "Awaiting parts", value: count(records, /awaiting/i), sub: "Blocked on stock" },
    ];
  }
  if (moduleKey === "quotes") {
    const paid = records.filter((record) => /paid/i.test(record.status));
    const pending = records.filter((record) => /pending|draft/i.test(record.status));
    return [
      { label: "Total", value: rand(sumOf(records)), sub: `${records.length} quotes` },
      {
        label: "Paid",
        value: rand(sumOf(paid)),
        sub: `${paid.length} quote${paid.length === 1 ? "" : "s"}`,
      },
      {
        label: "Pending",
        value: rand(sumOf(pending)),
        sub: `${pending.length} awaiting a decision`,
      },
    ];
  }
  if (moduleKey === "parts") {
    return [
      {
        label: "In stock",
        value: count(records, /in stock|low stock/i),
        sub: "Part lines on the shelf",
      },
      { label: "Low stock", value: count(records, /low/i), sub: "Needs reordering" },
      { label: "On order", value: count(records, /on order/i), sub: "Waiting on suppliers" },
      { label: "Customer parts", value: count(records, /customer/i), sub: "Held for customers" },
    ];
  }
  const total = (list: ModuleRecord[]) => sumOf(list);
  const average = (list: ModuleRecord[]) =>
    list.length ? Math.round(sumOf(list) / list.length) : 0;
  if (moduleKey === "appointments") {
    return [
      { label: "Appointments", value: records.length, sub: "In the diary" },
      {
        label: "Upcoming",
        value: count(records, /confirmed|in service/i),
        sub: "Still to be seen",
      },
      { label: "Completed", value: count(records, /completed/i), sub: "Done and ready to bill" },
      { label: "Booked value", value: rand(total(records)), sub: "Across all bookings" },
    ];
  }
  if (moduleKey === "floor-plan") {
    return [
      {
        label: "Occupied",
        value: count(records, /seated|ordered|awaiting|ready/i),
        sub: "Tables with guests",
      },
      { label: "Open tables", value: count(records, /empty/i), sub: "Ready to seat" },
      { label: "Reserved", value: count(records, /reserved/i), sub: "Held for bookings" },
      { label: "Awaiting payment", value: count(records, /awaiting/i), sub: "Bills to settle" },
    ];
  }
  if (moduleKey === "kitchen") {
    return [
      { label: "Queued", value: count(records, /queued/i), sub: "Not yet started" },
      { label: "Cooking", value: count(records, /cooking/i), sub: "On the pass" },
      { label: "Ready", value: count(records, /ready/i), sub: "Waiting to be served" },
      { label: "Tickets", value: records.length, sub: "Open this service" },
    ];
  }
  if (moduleKey === "inventory") {
    return [
      { label: "Products", value: records.length, sub: "Stock lines tracked" },
      { label: "Low stock", value: count(records, /low/i), sub: "Needs reordering" },
      { label: "Units on hand", value: total(records), sub: "Across all products" },
      {
        label: "Out of stock",
        value: records.filter((record) => numberIn(record.value) === 0).length,
        sub: "Unavailable now",
      },
    ];
  }
  if (moduleKey === "catalog") {
    return [
      { label: "Products", value: records.length, sub: "In the catalog" },
      { label: "Active", value: count(records, /active/i), sub: "Available to sell" },
      { label: "Average price", value: rand(average(records)), sub: "Per product" },
      {
        label: "Highest price",
        value: rand(Math.max(0, ...records.map((record) => numberIn(record.value)))),
        sub: "Top of the range",
      },
    ];
  }
  if (moduleKey === "staff") {
    return [
      { label: "Team", value: records.length, sub: "Staff members" },
      { label: "Available today", value: count(records, /available/i), sub: "On shift" },
      { label: "Off today", value: count(records, /off/i), sub: "Not working" },
      { label: "Avg utilisation", value: `${average(records)}%`, sub: "Of working hours" },
    ];
  }
  if (moduleKey === "packages") {
    return [
      { label: "Packages", value: records.length, sub: "On offer" },
      { label: "Average price", value: rand(average(records)), sub: "Per package" },
      {
        label: "Highest price",
        value: rand(Math.max(0, ...records.map((record) => numberIn(record.value)))),
        sub: "Premium package",
      },
    ];
  }
  if (moduleKey === "scheduling") {
    return [
      { label: "Visits", value: records.length, sub: "On the schedule" },
      { label: "In progress", value: count(records, /progress/i), sub: "Crews on site" },
      { label: "Completed", value: count(records, /completed/i), sub: "Done today" },
      {
        label: "Unassigned",
        value: records.filter((record) => /unassigned/i.test(record.detail)).length,
        sub: "Need a crew",
      },
    ];
  }
  if (moduleKey === "billing") {
    const owed = records.filter((record) => !/paid/i.test(record.status));
    return [
      { label: "Due", value: count(records, /due/i), sub: "Ready to invoice" },
      { label: "Upcoming", value: count(records, /upcoming/i), sub: "Next billing run" },
      { label: "Paid", value: count(records, /paid/i), sub: "Settled" },
      { label: "Outstanding", value: rand(total(owed)), sub: "Still to collect" },
    ];
  }
  if (moduleKey === "crew") {
    return [
      { label: "Crews", value: records.length, sub: "In the field" },
      { label: "Available", value: count(records, /available/i), sub: "Can take more work" },
      { label: "At capacity", value: count(records, /capacity/i), sub: "Fully booked" },
    ];
  }
  const attention = count(records, /low|due|pending|awaiting|off|draft/i);
  return [
    { label: "Total", value: records.length, sub: "Demo records" },
    { label: "Active", value: records.length - attention, sub: "In today's view" },
    { label: "Attention", value: attention, sub: "Requires follow-up" },
    { label: "Updated", value: "Now", sub: "Saved in this browser" },
  ];
}

export function ModulePage({ moduleKey }: { moduleKey: ModuleKey }) {
  const { niche, addToCart } = useProduct();
  const config = nicheConfigs[niche];
  const live = useLive();
  const records = live.records[moduleKey] ?? moduleRecords[moduleKey] ?? [];
  const setRecords = (update: (current: ModuleRecord[]) => ModuleRecord[]) =>
    setModuleRecords(moduleKey, update(records));
  const [selected, setSelected] = useState<ModuleRecord | null>(null);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [view, setView] = useState<"Calendar" | "List">("Calendar");
  const [dialog, setDialog] = useState<"job" | "quote" | "part" | "form" | null>(null);
  const hasCalendar = calendarModules.includes(moduleKey);
  const statuses = useMemo(
    () => ["All", ...new Set(records.map((record) => String(record.status)))],
    [records],
  );
  const matches = (record: ModuleRecord) =>
    (filter === "All" || record.status === filter) &&
    (!query || `${record.name} ${record.detail}`.toLowerCase().includes(query.toLowerCase()));
  const shown = records.filter(matches);
  const [title, description] = titles[moduleKey];
  const kpis = kpisFor(moduleKey, records);

  const calendarEvents = records.flatMap((record, index) =>
    matches(record)
      ? [
          {
            id: String(index),
            date: record.date ?? addDays(TODAY, SEED_OFFSETS[index % SEED_OFFSETS.length] ?? 0),
            label: String(record.name).replace(/^\d{2} \w{3} · /, ""),
            detail: `${record.detail} · ${record.status}`,
            tone: /complete|done|paid|ready/i.test(String(record.status))
              ? ("done" as const)
              : ("default" as const),
          },
        ]
      : [],
  );

  const customers = [...live.customers, ...config.customers];
  const contactFor = (name: string) =>
    customers.find((customer) => customer.name.toLowerCase() === name.toLowerCase())?.phone ??
    "Not saved";

  const primaryLabel: string | null =
    moduleKey === "inventory"
      ? "Restock"
      : moduleKey === "catalog"
        ? "Add product"
        : moduleKey === "packages"
          ? "Sell package"
          : moduleKey === "billing"
            ? "Run billing"
            : moduleKey === "scheduling"
              ? "Mark complete"
              : moduleKey === "parts"
                ? "Use 1 on a job"
                : moduleKey === "jobs"
                  ? "Add to register"
                  : moduleKey === "kitchen"
                    ? "Advance status"
                    : null;

  const patch = (target: ModuleRecord, change: Partial<ModuleRecord>) =>
    setRecords((current) =>
      current.map((record) => (record.name === target.name ? { ...record, ...change } : record)),
    );

  const changeStatus = (status: string) => {
    if (!selected) return;
    patch(selected, { status });
    if (
      (moduleKey === "quotes" || moduleKey === "billing") &&
      status === "Paid" &&
      selected.status !== "Paid"
    ) {
      recordSale(
        niche,
        numberIn(selected.value),
        moduleKey === "quotes" ? "Quote paid" : "Invoice",
        1,
        moduleKey === "quotes" ? "Quote paid" : "Invoice paid",
      );
    }
    setSelected({ ...selected, status });
    setNotice(`${String(selected.name)} marked ${status.toLowerCase()}`);
  };

  const act = () => {
    if (!selected || !primaryLabel) return;
    if (["packages", "jobs", "scheduling"].includes(moduleKey))
      addToCart({
        id: `${moduleKey}-${String(selected.name)}`,
        name: String(selected.name),
        price: numberIn(selected.value) || 850,
        note: String(selected.detail),
      });
    if (moduleKey === "kitchen")
      patch(selected, { status: selected.status === "Queued" ? "Cooking" : "Ready" });
    if (moduleKey === "inventory")
      patch(selected, { value: Number(selected.value) + 12, status: "In stock" });
    if (moduleKey === "scheduling") patch(selected, { status: "Completed" });
    if (moduleKey === "parts") {
      const left = Math.max(0, Number(selected.value) - 1);
      patch(selected, { value: left, status: left <= 5 ? "Low stock" : selected.status });
    }
    if (moduleKey === "billing") {
      patch(selected, { status: "Paid" });
      recordSale(niche, numberIn(selected.value), "Invoice", 1, "Invoice paid");
    }
    setNotice(`${primaryLabel} completed for ${String(selected.name)}`);
    setSelected(null);
  };

  const onNew = () => {
    if (moduleKey === "jobs") setDialog("job");
    else if (moduleKey === "quotes") setDialog("quote");
    else if (moduleKey === "parts") setDialog("part");
    else if (moduleForms[moduleKey]) setDialog("form");
    else setNotice(`New ${title.toLowerCase()} item created`);
  };

  // Extra facts shown in the pop-up for workshop records.
  const [partA = "", partB = ""] = selected ? String(selected.name).split(" · ") : [];
  const [partC = "", partD = ""] = selected ? String(selected.detail).split(" · ") : [];
  const detailRows: Array<[string, string]> = !selected
    ? []
    : moduleKey === "jobs"
      ? [
          ["Job number", partA],
          ["Vehicle", partB || "—"],
          ["Customer", partC || "—"],
          ["Contact", contactFor(partC)],
          ["Work", partD || "—"],
          ["Estimate", String(selected.value)],
          ["Booked", selected.date ? shortDay(selected.date) : "Scheduled"],
        ]
      : moduleKey === "quotes"
        ? [
            ["Quote", partA],
            ["Customer", partB || "—"],
            ["Vehicle and issues", String(selected.detail)],
            ["Contact", contactFor(partB)],
            ["Amount", String(selected.value)],
          ]
        : moduleKey === "appointments"
          ? [
              ["When", partA],
              ["Client", partB || "—"],
              ["Service", partC || "—"],
              ["Stylist", partD || "Unassigned"],
              ["Price", String(selected.value)],
              ["Date", selected.date ? shortDay(selected.date) : "Today"],
            ]
          : moduleKey === "scheduling"
            ? [
                ["When", partA],
                ["Client", partB || "—"],
                ["Address", partC || "—"],
                ["Crew", partD || "Unassigned"],
                ["Type", String(selected.value)],
                ["Date", selected.date ? shortDay(selected.date) : "Today"],
              ]
            : moduleKey === "billing"
              ? [
                  ["Client", partA],
                  ["Schedule", partC || String(selected.detail)],
                  ["Amount", String(selected.value)],
                ]
              : [];
  const statusOptions: readonly string[] | null = statusSets[moduleKey] ?? null;

  return (
    <AppShell title={title} eyebrow={config.shortLabel}>
      <PageIntro
        title={title}
        description={description}
        action={
          <Button onClick={onNew}>
            <Plus />
            {newLabels[moduleKey] ?? moduleForms[moduleKey]?.label ?? "New"}
          </Button>
        }
      />
      <div
        className={`grid gap-3 ${kpis.length === 3 ? "grid-cols-3" : "grid-cols-2 lg:grid-cols-4"}`}
      >
        {kpis.map((kpi) => (
          <Stat key={kpi.label} label={kpi.label} value={kpi.value} sub={kpi.sub} />
        ))}
      </div>
      <Panel
        title={title}
        tour="records"
        action={
          <div className="flex max-w-full flex-wrap items-center gap-2">
            {hasCalendar && (
              <Segmented value={view} options={["Calendar", "List"] as const} onChange={setView} />
            )}
            <Segmented value={filter} options={statuses} onChange={setFilter} />
          </div>
        }
      >
        {searchable.includes(moduleKey) && (
          <label className="relative mb-4 block">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={
                moduleKey === "parts"
                  ? "Search parts, suppliers or customers"
                  : `Search ${title.toLowerCase()}`
              }
              aria-label={`Search ${title.toLowerCase()}`}
              className="w-full rounded-[14px] border border-border bg-secondary py-3 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-ring"
            />
          </label>
        )}
        {hasCalendar && view === "Calendar" ? (
          <MonthCalendar
            events={calendarEvents}
            emptyText={`Nothing booked for this day. ${title} added from the website appear here.`}
            onEventClick={(event) => setSelected(records[Number(event.id)] ?? null)}
          />
        ) : (
          <div
            className={
              moduleKey === "floor-plan"
                ? "grid grid-cols-2 gap-3 sm:grid-cols-3"
                : "divide-y divide-border"
            }
          >
            {shown.map((record, index) => (
              <button
                key={`${String(record.name)}-${index}`}
                onClick={() => setSelected(record)}
                className={`group w-full text-left ${moduleKey === "floor-plan" ? "panel-sm min-h-36 p-4" : "flex items-center gap-3 py-3.5"}`}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-secondary text-xs font-semibold">
                  {String(record.name).slice(0, 2)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{String(record.name)}</span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {String(record.detail)}
                  </span>
                  <span className="mt-2 inline-flex rounded-full border border-border bg-secondary px-2 py-1 text-[9px] uppercase tracking-[0.1em]">
                    {String(record.status)}
                  </span>
                </span>
                <span className="flex items-center gap-2 font-display text-xs font-semibold tnum">
                  {String(record.value)}
                  <ChevronRight className="size-4 text-muted-foreground" />
                </span>
              </button>
            ))}
            {shown.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Nothing matches. Try a different search or filter.
              </p>
            )}
          </div>
        )}
      </Panel>
      {notice && (
        <div className="fixed bottom-22 left-1/2 z-50 -translate-x-1/2 rounded-full bg-primary px-4 py-2 text-xs text-primary-foreground md:bottom-5">
          <Check className="mr-1 inline size-3" />
          {notice}
        </div>
      )}
      {selected && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/35 p-0 sm:items-center sm:p-6"
          onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}
        >
          <div className="panel max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-b-none p-5 sm:rounded-3xl">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted-foreground/30 sm:hidden" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">{String(selected.status)}</p>
                <h3 className="mt-1 font-display text-xl font-semibold">{String(selected.name)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{String(selected.detail)}</p>
              </div>
              <span className="font-display text-sm font-semibold tnum">
                {String(selected.value)}
              </span>
            </div>

            {detailRows.length > 0 && (
              <dl className="mt-4 divide-y divide-border rounded-2xl border border-border bg-secondary text-sm">
                {detailRows.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 px-3 py-2">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="text-right font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {statusOptions && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-muted-foreground">Update status</p>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={selected.status === status ? "default" : "outline"}
                      onClick={() => changeStatus(status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {(moduleKey === "staff" || moduleKey === "crew") && (
              <div className="my-5 flex items-center justify-between rounded-2xl border border-border bg-secondary p-3">
                <div>
                  <p className="text-sm font-medium">Active today</p>
                  <p className="text-xs text-muted-foreground">
                    Update this record's live availability
                  </p>
                </div>
                <Switch defaultChecked={String(selected.status) !== "Off today"} />
              </div>
            )}

            <div className="mt-5 flex gap-2">
              {primaryLabel && (
                <Button className="flex-1" onClick={act}>
                  {moduleKey === "kitchen" && <RotateCw />}
                  {primaryLabel}
                </Button>
              )}
              <Button
                variant="secondary"
                className={primaryLabel ? "" : "flex-1"}
                onClick={() => setSelected(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      <JobDialog open={dialog === "job"} onClose={() => setDialog(null)} />
      <QuoteDialog open={dialog === "quote"} onClose={() => setDialog(null)} />
      <PartDialog open={dialog === "part"} onClose={() => setDialog(null)} />
      <ModuleFormDialog
        moduleKey={moduleKey}
        open={dialog === "form"}
        onClose={() => setDialog(null)}
        existing={records}
      />
    </AppShell>
  );
}
