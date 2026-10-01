import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageIntro, Panel, Stat } from "@/components/AppShell";
import { useRevenue } from "@/lib/demo-data";
import { rand } from "@/lib/hotel-data";
import { pageMeta } from "@/lib/page-meta";
import { nicheConfigs, weekSeries } from "@/lib/platform-data";
import { useProduct } from "@/lib/product";

export const Route = createFileRoute("/reports")({
  head: () => pageMeta("Reports · Empirial POS", "Seven-day revenue and category performance."),
  component: Reports,
});

const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
const categoryTotals = [42860, 31240, 22880, 14620];

function Reports() {
  const { niche } = useProduct();
  const config = nicheConfigs[niche];
  const revenue = useRevenue(niche);
  const liveNote = revenue.liveCount
    ? ` Includes ${revenue.liveCount} live sale${revenue.liveCount === 1 ? "" : "s"} (${rand(revenue.liveTotal)}) from this demo.`
    : "";

  return (
    <AppShell title="Reports">
      <PageIntro
        title="Reports"
        description={`Seven-day performance across ${config.business}.${liveNote}`}
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="7-day revenue" value={rand(revenue.revenue)} sub="All channels" />
        <Stat
          label="Transactions"
          value={revenue.transactions}
          sub={revenue.liveCount ? `${revenue.liveCount} new this session` : "+8% this week"}
        />
        <Stat label="Average sale" value={rand(revenue.average)} sub="Across settled checks" />
        <Stat label="Best day" value="Friday" sub={rand(revenue.bestDay)} />
      </div>
      <Panel title="Revenue by day">
        <div className="flex h-56 items-end gap-3">
          {weekSeries.map((value, index) => (
            <div key={days[index]} className="flex h-full flex-1 flex-col justify-end gap-2">
              <div
                className="relative overflow-hidden rounded-t-xl border border-border bg-secondary"
                style={{ height: `${value}%` }}
              >
                <div
                  className="absolute inset-x-0 bottom-0 bg-primary"
                  style={{ height: `${Math.round(value * 0.68)}%` }}
                />
              </div>
              <span className="text-center text-[10px] text-muted-foreground">{days[index]}</span>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Category performance">
        <div className="divide-y divide-border">
          {config.categories.map((category, index) => (
            <div key={category} className="flex items-center justify-between py-3">
              <span>
                <span className="block text-sm font-medium">{category}</span>
                <span className="text-xs text-muted-foreground">{38 - index * 6} transactions</span>
              </span>
              <span className="font-display text-sm font-semibold tnum">
                {rand(categoryTotals[index] ?? 9240)}
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </AppShell>
  );
}
