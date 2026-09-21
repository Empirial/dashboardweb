import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Panel } from "@/components/AppShell";
import { guests as allGuests, rand } from "@/lib/hotel-data";

export const Route = createFileRoute("/guests")({
  head: () => ({
    meta: [
      { title: "Guests · Empirial Hotel Ops" },
      {
        name: "description",
        content: "Guest profiles, open folios and stay history for Empirial Hotel.",
      },
      { property: "og:title", content: "Guests · Empirial Hotel Ops" },
      {
        property: "og:description",
        content: "Search Empirial Hotel guests and see open folio balances at a glance.",
      },
    ],
  }),
  component: Guests,
});

const tierPill: Record<string, string> = {
  VIP: "bg-accent text-accent-foreground",
  Returning: "bg-occupied/10 text-occupied-foreground",
  New: "bg-secondary text-muted-foreground",
};

function Guests() {
  const [query, setQuery] = useState("");
  const shown = allGuests.filter((g) => g.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <AppShell>
      <Panel title="Guest Directory">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name"
          className="mb-3 w-full rounded-lg bg-secondary px-3 py-2 text-[12px] ring-1 ring-border outline-none placeholder:text-muted-foreground focus:ring-ring"
        />
        <div className="divide-y divide-line">
          {shown.map((g) => (
            <div key={g.name} className="flex items-center gap-3 py-2.5">
              <div className="grid size-9 place-items-center rounded-full bg-secondary font-mono text-[11px] font-medium">
                {g.initials}
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[12px] font-medium">{g.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${tierPill[g.tier]}`}
                  >
                    {g.tier}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {g.room ? `Rm ${g.room} · ` : "Not in house · "}
                  {g.phone} · {g.stays} stay{g.stays > 1 ? "s" : ""}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[11px] font-medium tnum">{rand(g.folio)}</div>
                <div className="text-[9px] text-muted-foreground">open folio</div>
              </div>
            </div>
          ))}
          {shown.length === 0 && (
            <p className="py-6 text-center text-[11px] text-muted-foreground">No guest found.</p>
          )}
        </div>
      </Panel>
    </AppShell>
  );
}
