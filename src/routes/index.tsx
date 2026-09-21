import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Panel, Stat } from "@/components/AppShell";
import { bookings, kpis, rand, rooms, statusDot, statusLabel, statusClasses } from "@/lib/hotel-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Front Desk · Empirial Hotel Ops" },
      {
        name: "description",
        content:
          "Empirial Hotel front-desk dashboard: occupancy, room board, live POS checks and today's arrivals.",
      },
      { property: "og:title", content: "Front Desk · Empirial Hotel Ops" },
      {
        property: "og:description",
        content: "Occupancy, room status, POS checks and arrivals for Empirial Hotel.",
      },
    ],
  }),
  component: Desk,
});

function Desk() {
  const board = rooms.filter((r) => r.floor === 2);
  const arrivals = bookings.filter((b) => b.status === "Confirmed" || b.status === "Pending");

  return (
    <AppShell>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <Stat
          label="Occupancy"
          value={
            <>
              {kpis.occupancyPct}
              <span className="text-sm text-muted-foreground">%</span>
            </>
          }
          sub={`${kpis.occupied} / ${kpis.totalRooms} rooms`}
        />
        <Stat label="ADR" value={rand(kpis.adr)} sub={kpis.adrDelta} subTone="positive" />
        <Stat
          label="Today's Revenue"
          value={rand(kpis.revenueToday)}
          sub={`incl. F&B ${rand(kpis.fnbToday)}`}
        />
        <Stat label="Arrivals" value={kpis.arrivals} sub={`${kpis.checkedIn} checked in`} />
      </div>

      <Panel
        title="Room Board"
        action={
          <div className="flex gap-2 text-[10px]">
            {(["clean", "dirty", "occupied"] as const).map((s) => (
              <span key={s} className="flex items-center gap-1">
                <i className={`inline-block size-2 rounded-full ${statusDot[s]}`} />
                {statusLabel[s]}
              </span>
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 lg:grid-cols-8">
          {board.map((room) => (
            <Link
              key={room.number}
              to="/rooms"
              className={`rounded-lg py-2 text-center transition-transform active:scale-95 ${statusClasses[room.status]}`}
            >
              <div className="font-mono text-xs font-medium text-ink">{room.number}</div>
              <div className="text-[9px]">{statusLabel[room.status]}</div>
            </Link>
          ))}
        </div>
      </Panel>

      <Panel
        title="POS · Bar & Kitchen"
        action={
          <Link to="/pos" className="text-[11px] font-medium text-accent-foreground">
            Open register
          </Link>
        }
      >
        <div className="rounded-xl bg-ink p-3 text-paper">
          <div className="mb-2 text-[10px] uppercase tracking-[0.16em] text-paper/50">
            Live Check · Rm 209
          </div>
          <div className="space-y-1.5 text-[12px]">
            <div className="flex justify-between">
              <span>2 × Amarula</span>
              <span className="font-mono tnum">R130</span>
            </div>
            <div className="flex justify-between">
              <span>1 × Fresh Juice</span>
              <span className="font-mono tnum">R45</span>
            </div>
            <div className="flex justify-between">
              <span>1 × Nespresso</span>
              <span className="font-mono tnum">R38</span>
            </div>
          </div>
          <div className="my-2.5 h-px bg-paper/15" />
          <div className="flex items-end justify-between">
            <span className="text-[11px] text-paper/60">Total</span>
            <span className="font-mono text-xl font-semibold tnum">R213</span>
          </div>
          <div className="mt-3 flex gap-2">
            <Link
              to="/pos"
              className="flex-1 rounded-lg bg-brass py-2.5 text-center text-[12px] font-semibold text-brass-foreground"
            >
              Charge to Room
            </Link>
            <Link
              to="/pos"
              className="rounded-lg bg-paper/10 px-3 py-2.5 text-center text-[12px] font-medium"
            >
              Card
            </Link>
          </div>
        </div>
      </Panel>

      <Panel
        title="Upcoming Arrivals"
        action={
          <Link to="/bookings" className="text-[11px] font-medium text-accent-foreground">
            All bookings
          </Link>
        }
      >
        <div className="divide-y divide-line">
          {arrivals.map((b) => (
            <div key={b.ref} className="flex items-center gap-3 py-2">
              <div className="grid size-9 place-items-center rounded-full bg-secondary font-mono text-[11px] font-medium">
                {b.initials}
              </div>
              <div className="flex-1 leading-tight">
                <div className="text-[12px] font-medium">{b.guest}</div>
                <div className="text-[10px] text-muted-foreground">
                  {b.roomType} · {b.arrival} {b.time}
                </div>
              </div>
              <span className="font-mono text-[10px] tnum text-muted-foreground">
                {rand(b.total)}
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </AppShell>
  );
}
