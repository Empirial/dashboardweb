import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageIntro, Panel, Stat } from "@/components/AppShell";
import { RevenueChart } from "@/components/RevenueChart";
import { useRevenue, useWeekRevenue } from "@/lib/demo-data";
import { rand } from "@/lib/hotel-data";
import { pageMeta } from "@/lib/page-meta";
import { nicheConfigs } from "@/lib/platform-data";
import { useProduct } from "@/lib/product";

export const Route = createFileRoute("/reports")({
  head: () => pageMeta("Reports · Empirial POS", "Seven-day revenue and category performance."),
  component: Reports,
});

const categoryTotals = [42860, 31240, 22880, 14620];

function Reports() {
  const { niche } = useProduct();
  const config = nicheConfigs[niche];
  const revenue = useRevenue(niche);
  const week = useWeekRevenue(niche);
  const bestDay = week.rows.reduce((best, row) => (row.total > best.total ? row : best));
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
        <Stat label="Best day" value={bestDay.label} sub={rand(bestDay.total)} />
      </div>
      <Panel title="Revenue by day">
        <RevenueChart niche={niche} labels={config.revenueLabels} tall />
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
