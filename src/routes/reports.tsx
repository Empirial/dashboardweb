import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Panel, Stat } from "@/components/AppShell";
import { kpis, posOutlets, rand, revenueWeek } from "@/lib/hotel-data";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports · Empirial Hotel Ops" },
      {
        name: "description",
        content: "Weekly rooms and F&B revenue, outlet performance and key trading ratios for Empirial Hotel.",
      },
      { property: "og:title", content: "Reports · Empirial Hotel Ops" },
      {
        property: "og:description",
        content: "Seven-day revenue split, outlet sales and trading ratios for Empirial Hotel.",
      },
    ],
  }),
  component: Reports,
});

function Reports() {
  const max = Math.max(...revenueWeek.map((d) => d.rooms + d.fnb));
  const weekTotal = revenueWeek.reduce((s, d) => s + d.rooms + d.fnb, 0);

  return (
    <AppShell>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <Stat label="7-day revenue" value={rand(weekTotal)} sub="rooms + F&B" />
        <Stat label="RevPAR" value={rand(1693)} sub="▲ 2.8% vs wk" subTone="positive" />
        <Stat label="ADR" value={rand(kpis.adr)} sub={kpis.adrDelta} subTone="positive" />
        <Stat label="F&B share" value="17%" sub="of total revenue" />
      </div>

      <Panel title="Revenue · last 7 days">
        <div className="flex items-end gap-2">
          {revenueWeek.map((d) => {
            const h = ((d.rooms + d.fnb) / max) * 120;
            const fnbH = (d.fnb / (d.rooms + d.fnb)) * h;
            return (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="flex w-full flex-col justify-end overflow-hidden rounded-t-md bg-ink/80"
                  style={{ height: `${h}px` }}
                >
                  <div className="w-full bg-brass" style={{ height: `${fnbH}px` }} />
                </div>
                <span className="text-[10px] text-muted-foreground">{d.day}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <i className="inline-block size-2 rounded-full bg-ink" />
            Rooms
          </span>
          <span className="flex items-center gap-1">
            <i className="inline-block size-2 rounded-full bg-brass" />
            Food &amp; Beverage
          </span>
        </div>
      </Panel>

      <Panel title="Outlet performance">
        <div className="divide-y divide-line">
          {posOutlets.map((o) => (
            <div key={o.name} className="flex items-center justify-between py-2.5">
              <div className="leading-tight">
                <div className="text-[12px] font-medium">{o.name}</div>
                <div className="text-[10px] text-muted-foreground">{o.checks} checks today</div>
              </div>
              <span className="font-mono text-[12px] font-medium tnum">{rand(o.sales)}</span>
            </div>
          ))}
        </div>
      </Panel>
    </AppShell>
  );
}
