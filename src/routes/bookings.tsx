import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Panel, Stat } from "@/components/AppShell";
import { bookings as allBookings, kpis, rand, type Booking } from "@/lib/hotel-data";

export const Route = createFileRoute("/bookings")({
  head: () => ({
    meta: [
      { title: "Bookings · Empirial Hotel Ops" },
      {
        name: "description",
        content: "Reservations, arrivals and departures for Empirial Hotel with channel and folio totals.",
      },
      { property: "og:title", content: "Bookings · Empirial Hotel Ops" },
      {
        property: "og:description",
        content: "Track Empirial Hotel reservations by status, channel and arrival time.",
      },
    ],
  }),
  component: Bookings,
});

const tabs: Array<Booking["status"] | "All"> = [
  "All",
  "Confirmed",
  "Checked in",
  "Checked out",
  "Pending",
];

const statusPill: Record<Booking["status"], string> = {
  Confirmed: "bg-occupied/10 text-occupied-foreground",
  "Checked in": "bg-clean/10 text-clean-foreground",
  "Checked out": "bg-secondary text-muted-foreground",
  Pending: "bg-dirty/10 text-dirty-foreground",
};

function Bookings() {
  const [tab, setTab] = useState<Booking["status"] | "All">("All");
  const shown = tab === "All" ? allBookings : allBookings.filter((b) => b.status === tab);

  return (
    <AppShell>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <Stat label="Arrivals today" value={kpis.arrivals} sub={`${kpis.checkedIn} checked in`} />
        <Stat label="Departures" value={kpis.departures} sub="checkout by 10:00" />
        <Stat label="In house" value={kpis.occupied} sub="guests on property" />
        <Stat label="Booked value" value={rand(24760)} sub="next 7 days" />
      </div>

      <Panel title="Reservations">
        <div className="mb-3 flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                tab === t ? "bg-brass text-brass-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="divide-y divide-line">
          {shown.map((b) => (
            <div key={b.ref} className="flex items-center gap-3 py-2.5">
              <div className="grid size-9 place-items-center rounded-full bg-secondary font-mono text-[11px] font-medium">
                {b.initials}
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[12px] font-medium">{b.guest}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{b.ref}</span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {b.roomType} {b.room} · {b.nights} night{b.nights > 1 ? "s" : ""} · {b.arrival}{" "}
                  {b.time} · {b.channel}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[11px] font-medium tnum">{rand(b.total)}</div>
                <span
                  className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[9px] font-medium ${statusPill[b.status]}`}
                >
                  {b.status}
                </span>
              </div>
            </div>
          ))}
          {shown.length === 0 && (
            <p className="py-6 text-center text-[11px] text-muted-foreground">
              No reservations in this state.
            </p>
          )}
        </div>
      </Panel>
    </AppShell>
  );
}
