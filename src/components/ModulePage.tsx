import { useMemo, useState } from "react";
import { Check, ChevronRight, Plus, RotateCw } from "lucide-react";
import { AppShell, PageIntro, Panel, Segmented, Stat } from "./AppShell";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { moduleRecords, type ModuleKey } from "@/lib/platform-data";
import { useProduct } from "@/lib/product";
import { nicheConfigs } from "@/lib/platform-data";

const titles: Record<ModuleKey, [string, string]> = {
  rooms: ["Room board", "Manage live room condition and fourteen-night availability."], bookings: ["Bookings", "Track reservations, arrival status, and folios."],
  "floor-plan": ["Floor plan", "Open tables, return to live checks, and track dining progress."], kitchen: ["Kitchen display", "Move tickets from queue through cooking to ready."],
  inventory: ["Inventory", "Monitor stock, thresholds, and incoming replenishment."], catalog: ["Product catalog", "Manage products, variants, pricing, and barcodes."],
  appointments: ["Appointments", "Manage the studio calendar and book available time."], staff: ["Studio staff", "Review specialties, schedules, and today's availability."], packages: ["Packages", "Bundle services and send packages directly to the register."],
  jobs: ["Job cards", "Track workshop progress, labor, parts, and collection."], parts: ["Parts", "Manage workshop stock, suppliers, and reorder levels."], quotes: ["Quotes", "Build estimates and convert approved work into jobs."],
  scheduling: ["Job schedule", "Coordinate recurring and one-off property visits."], billing: ["Recurring billing", "Preview and process the next client billing batch."], crew: ["Crew", "Balance availability and daily field assignments."],
};

export function ModulePage({ moduleKey }: { moduleKey: ModuleKey }) {
  const { niche, addToCart } = useProduct();
  const config = nicheConfigs[niche];
  const initial = moduleRecords[moduleKey] ?? [];
  const [records, setRecords] = useState(initial);
  const [selected, setSelected] = useState<Record<string, string | number | boolean> | null>(null);
  const [filter, setFilter] = useState("All");
  const [notice, setNotice] = useState("");
  const statuses = useMemo(() => ["All", ...new Set(records.map((record) => String(record.status)))], [records]);
  const shown = filter === "All" ? records : records.filter((record) => record.status === filter);
  const [title, description] = titles[moduleKey];

  const primaryLabel = moduleKey === "inventory" ? "Restock" : moduleKey === "catalog" ? "Add product" : moduleKey === "packages" ? "Sell package" : moduleKey === "quotes" ? "Convert to invoice" : moduleKey === "billing" ? "Run billing" : moduleKey === "scheduling" ? "Mark complete" : moduleKey === "parts" ? "Add to job" : moduleKey === "kitchen" ? "Advance status" : "Open details";
  const act = () => {
    if (!selected) return;
    if (["packages", "jobs", "scheduling"].includes(moduleKey)) addToCart({ id: `${moduleKey}-${String(selected.name)}`, name: String(selected.name), price: Number(String(selected.value).replace(/[^0-9]/g, "")) || 850, note: String(selected.detail) });
    if (moduleKey === "kitchen") setRecords((current) => current.map((record) => record.name === selected.name ? { ...record, status: record.status === "Queued" ? "Cooking" : "Ready" } : record));
    setNotice(`${primaryLabel} completed for ${String(selected.name)}`);
    setSelected(null);
  };

  return <AppShell title={title} eyebrow={config.shortLabel}><PageIntro title={title} description={description} action={<Button onClick={() => setNotice(`New ${title.toLowerCase()} item created`)}><Plus />New</Button>} />
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><Stat label="Total" value={records.length} sub="Mock records" /><Stat label="Active" value={Math.max(1, records.length - 1)} sub="In today's view" /><Stat label="Attention" value="1" sub="Requires follow-up" /><Stat label="Updated" value="Now" sub="Session data" /></div>
    <Panel title={title} action={<Segmented value={filter} options={statuses} onChange={setFilter} />}>
      <div className={moduleKey === "floor-plan" ? "grid grid-cols-2 gap-3 sm:grid-cols-3" : "divide-y divide-border"}>{shown.map((record) => <button key={String(record.name)} onClick={() => setSelected(record)} className={`group w-full text-left ${moduleKey === "floor-plan" ? "panel-sm min-h-36 p-4" : "flex items-center gap-3 py-3.5"}`}><span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-secondary text-xs font-semibold">{String(record.name).slice(0, 2)}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{String(record.name)}</span><span className="mt-0.5 block truncate text-xs text-muted-foreground">{String(record.detail)}</span><span className="mt-2 inline-flex rounded-full border border-border bg-secondary px-2 py-1 text-[9px] uppercase tracking-[0.1em]">{String(record.status)}</span></span><span className="flex items-center gap-2 font-display text-xs font-semibold tnum">{String(record.value)}<ChevronRight className="size-4 text-muted-foreground" /></span></button>)}</div>
    </Panel>
    {notice && <div className="fixed bottom-22 left-1/2 z-50 -translate-x-1/2 rounded-full bg-primary px-4 py-2 text-xs text-primary-foreground md:bottom-5"><Check className="mr-1 inline size-3" />{notice}</div>}
    {selected && <div className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/35 p-0 sm:items-center sm:p-6" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}><div className="panel max-h-[88vh] w-full max-w-lg rounded-b-none p-5 sm:rounded-3xl"><div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted-foreground/30 sm:hidden" /><div className="flex items-start justify-between"><div><p className="text-xs text-muted-foreground">{String(selected.status)}</p><h3 className="mt-1 font-display text-xl font-semibold">{String(selected.name)}</h3><p className="mt-1 text-sm text-muted-foreground">{String(selected.detail)}</p></div><span className="font-display text-sm font-semibold tnum">{String(selected.value)}</span></div><div className="my-5 flex items-center justify-between rounded-2xl border border-border bg-secondary p-3"><div><p className="text-sm font-medium">Active today</p><p className="text-xs text-muted-foreground">Update this record's live availability</p></div><Switch defaultChecked={String(selected.status) !== "Off today"} /></div><div className="flex gap-2"><Button className="flex-1" onClick={act}>{moduleKey === "kitchen" && <RotateCw />}{primaryLabel}</Button><Button variant="secondary" onClick={() => setSelected(null)}>Close</Button></div></div></div>}
  </AppShell>;
}
