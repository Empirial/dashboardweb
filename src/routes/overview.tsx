import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { AppShell, PageIntro, Panel, Stat } from "@/components/AppShell";
import { RevenueChart } from "@/components/RevenueChart";
import { Button } from "@/components/ui/button";
import { liveKpis, useLive, useRevenue } from "@/lib/demo-data";
import { rand } from "@/lib/hotel-data";
import { nicheConfigs } from "@/lib/platform-data";
import { useProduct } from "@/lib/product";
import { useReservations } from "@/lib/reservations";

export const Route = createFileRoute("/overview")({
  head: () => ({
    meta: [
      { title: "Overview · Empirial POS" },
      {
        name: "description",
        content: "Daily operations, revenue, and activity across the Empirial POS platform.",
      },
      { property: "og:title", content: "Overview · Empirial POS" },
      {
        property: "og:description",
        content: "Daily operations, revenue, and activity across the Empirial POS platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { niche } = useProduct();
  const config = nicheConfigs[niche];
  const firstModule = config.modules[0];
  const revenue = useRevenue(niche);
  const { feed, records } = useLive();
  const reservations = useReservations();
  const kpis = liveKpis(
    niche,
    config.kpis,
    records,
    reservations,
    revenue.liveTotal,
    revenue.liveCount,
  );
  const activity = [...feed.filter((item) => item.niche === niche), ...config.activity].slice(0, 6);
  return (
    <AppShell title="Overview">
      <PageIntro
        title={`Good evening, ${config.business}`}
        description="The live shape of today's operations, sales, and attention points."
        action={
          <Button asChild>
            {firstModule ? (
              <Link to={`/${firstModule.key}` as "/rooms"}>
                Open {firstModule.label}
                <ArrowUpRight />
              </Link>
            ) : (
              <Link to="/pos">
                Open register
                <ArrowUpRight />
              </Link>
            )}
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Stat key={kpi.label} {...kpi} />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <Panel
          title="Revenue · last 7 days"
          tour="revenue-chart"
          action={
            <span className="font-display text-sm font-semibold tnum">{rand(revenue.revenue)}</span>
          }
        >
          <RevenueChart niche={niche} labels={config.revenueLabels} />
          {revenue.liveCount > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              Includes {rand(revenue.liveTotal)} from {revenue.liveCount} live sale
              {revenue.liveCount === 1 ? "" : "s"} this session.
            </p>
          )}
        </Panel>
        <Panel title="Live activity" tour="activity">
          <div className="divide-y divide-border">
            {activity.map((item, index) => (
              <div key={`${item.title}-${index}`} className="flex items-center gap-3 py-3">
                <span className="grid size-9 place-items-center rounded-xl border border-border bg-secondary text-[10px] font-semibold">
                  {item.title.slice(0, 2).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{item.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {item.detail}
                  </span>
                </span>
                <span className="text-[10px] text-muted-foreground tnum">{item.time}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <Panel title={`${config.shortLabel} workspace`}>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {config.modules.map((module) => (
            <Link
              key={module.key}
              to={`/${module.key}` as "/rooms"}
              className="flex items-center justify-between rounded-2xl border border-border bg-secondary p-4 transition-colors hover:bg-accent"
            >
              <span>
                <span className="block text-sm font-medium">{module.label}</span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  Open today's workspace
                </span>
              </span>
              <ChevronRight className="size-4" />
            </Link>
          ))}
        </div>
      </Panel>
    </AppShell>
  );
}
