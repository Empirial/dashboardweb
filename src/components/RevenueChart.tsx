import { useWeekRevenue } from "@/lib/demo-data";
import { rand } from "@/lib/hotel-data";
import type { Niche } from "@/lib/product";

const compact = (value: number) =>
  value >= 1000 ? `R${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k` : rand(value);

/** Seven days of revenue ending today. Live sales stack on top of each day's baseline. */
export function RevenueChart({
  niche,
  labels,
  tall = false,
}: {
  niche: Niche;
  labels: [string, string];
  tall?: boolean;
}) {
  const { rows, max } = useWeekRevenue(niche);
  const liveTotal = rows.reduce((total, row) => total + row.live, 0);

  return (
    <div>
      <div className={`flex ${tall ? "h-56" : "h-44"} items-end gap-2`}>
        {rows.map((row) => {
          const height = Math.max(6, Math.round((row.total / max) * 80));
          const livePercent = row.total ? (row.live / row.total) * 100 : 0;
          return (
            <div
              key={row.date}
              title={`${row.label}: ${rand(row.total)}${row.live ? ` (${rand(row.live)} live)` : ""}`}
              className="flex h-full flex-1 flex-col justify-end gap-1.5"
            >
              <span className="text-center text-[9px] text-muted-foreground tnum">
                {compact(row.total)}
              </span>
              <div
                className="flex flex-col justify-end overflow-hidden rounded-t-xl border border-border bg-secondary"
                style={{ height: `${height}%` }}
              >
                <div className="bg-foreground" style={{ height: `${livePercent}%` }} />
                <div
                  className="bg-primary"
                  style={{ height: `${Math.round((100 - livePercent) * 0.72)}%` }}
                />
              </div>
              <span
                className={`text-center text-[10px] ${row.label === "Today" ? "font-semibold text-foreground" : "text-muted-foreground"}`}
              >
                {row.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        <span>
          <i className="mr-2 inline-block size-2 rounded-full bg-primary" />
          {labels[0]}
        </span>
        <span>
          <i className="mr-2 inline-block size-2 rounded-full bg-muted-foreground" />
          {labels[1]}
        </span>
        <span>
          <i className="mr-2 inline-block size-2 rounded-full bg-foreground" />
          Live sales{liveTotal ? ` · ${rand(liveTotal)}` : ""}
        </span>
      </div>
    </div>
  );
}
