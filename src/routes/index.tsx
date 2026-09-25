import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { AppShell, PageIntro, Panel, Stat } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { nicheConfigs, weekSeries } from "@/lib/platform-data";
import { useProduct } from "@/lib/product";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Overview · Empirial POS" }, { name: "description", content: "Daily operations, revenue, and activity across the Empirial POS platform." }, { property: "og:title", content: "Overview · Empirial POS" }, { property: "og:description", content: "Daily operations, revenue, and activity across the Empirial POS platform." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }), component: Overview,
});

function Overview() {
  const { niche } = useProduct(); const config = nicheConfigs[niche]; const firstModule = config.modules[0];
  return <AppShell title="Overview"><PageIntro title={`Good evening, ${config.business}`} description="The live shape of today's operations, sales, and attention points." action={<Button asChild>{firstModule ? <Link to={`/${firstModule.key}` as "/rooms"}>Open {firstModule.label}<ArrowUpRight /></Link> : <Link to="/pos">Open register<ArrowUpRight /></Link>}</Button>} />
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{config.kpis.map((kpi) => <Stat key={kpi.label} {...kpi} />)}</div>
    <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
      <Panel title="Revenue · last 7 days" action={<span className="font-display text-sm font-semibold tnum">R284 620</span>}><div className="flex h-44 items-end gap-2">{weekSeries.map((value, index) => <div key={index} className="flex h-full flex-1 flex-col justify-end gap-2"><div className="relative overflow-hidden rounded-t-xl border border-border bg-secondary" style={{ height: `${value}%` }}><div className="absolute inset-x-0 bottom-0 bg-primary" style={{ height: `${Math.round(value * 0.72)}%` }} /></div><span className="text-center text-[10px] text-muted-foreground">{["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"][index]}</span></div>)}</div><div className="mt-4 flex gap-5 text-[10px] uppercase tracking-[0.1em] text-muted-foreground"><span><i className="mr-2 inline-block size-2 rounded-full bg-primary" />{config.revenueLabels[0]}</span><span><i className="mr-2 inline-block size-2 rounded-full bg-muted-foreground" />{config.revenueLabels[1]}</span></div></Panel>
      <Panel title="Live activity"><div className="divide-y divide-border">{config.activity.map((item) => <div key={item.title} className="flex items-center gap-3 py-3"><span className="grid size-9 place-items-center rounded-xl border border-border bg-secondary text-[10px] font-semibold">{item.title.slice(0, 2).toUpperCase()}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{item.title}</span><span className="block truncate text-xs text-muted-foreground">{item.detail}</span></span><span className="text-[10px] text-muted-foreground tnum">{item.time}</span></div>)}</div></Panel>
    </div>
    <Panel title={`${config.shortLabel} workspace`}><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{config.modules.map((module) => <Link key={module.key} to={`/${module.key}` as "/rooms"} className="flex items-center justify-between rounded-2xl border border-border bg-secondary p-4 transition-colors hover:bg-accent"><span><span className="block text-sm font-medium">{module.label}</span><span className="mt-1 block text-xs text-muted-foreground">Open today's workspace</span></span><ChevronRight className="size-4" /></Link>)}</div></Panel>
  </AppShell>;
}
