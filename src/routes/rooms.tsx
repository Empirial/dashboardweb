import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, Panel, Stat } from "@/components/AppShell";
import {
  rand,
  rooms as allRooms,
  statusClasses,
  statusDot,
  statusLabel,
  type RoomStatus,
} from "@/lib/hotel-data";

export const Route = createFileRoute("/rooms")({
  head: () => ({
    meta: [
      { title: "Room Board · Empirial Hotel Ops" },
      {
        name: "description",
        content: "Housekeeping and availability board for every Empirial Hotel room, floor by floor.",
      },
      { property: "og:title", content: "Room Board · Empirial Hotel Ops" },
      {
        property: "og:description",
        content: "Live housekeeping status and rates for all Empirial Hotel rooms.",
      },
    ],
  }),
  component: Rooms,
});

const filters: Array<{ key: RoomStatus | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "clean", label: "Clean" },
  { key: "dirty", label: "Dirty" },
  { key: "occupied", label: "Occupied" },
  { key: "ooo", label: "Out of order" },
];

function Rooms() {
  const [filter, setFilter] = useState<RoomStatus | "all">("all");

  const counts = useMemo(() => {
    return allRooms.reduce<Record<string, number>>((acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    }, {});
  }, []);

  const shown = filter === "all" ? allRooms : allRooms.filter((r) => r.status === filter);
  const floors = [1, 2, 3];

  return (
    <AppShell>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <Stat label="Clean" value={counts.clean ?? 0} sub="ready to sell" />
        <Stat label="Dirty" value={counts.dirty ?? 0} sub="housekeeping queue" />
        <Stat label="Occupied" value={counts.occupied ?? 0} sub="in house" />
        <Stat label="Out of order" value={counts.ooo ?? 0} sub="maintenance" />
      </div>

      <Panel
        title="Status filter"
        action={
          <div className="flex gap-2 text-[10px]">
            {(["clean", "dirty", "occupied", "ooo"] as const).map((s) => (
              <span key={s} className="flex items-center gap-1">
                <i className={`inline-block size-2 rounded-full ${statusDot[s]}`} />
                {statusLabel[s]}
              </span>
            ))}
          </div>
        }
      >
        <div className="flex gap-1 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                filter === f.key
                  ? "bg-brass text-brass-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Panel>

      {floors.map((floor) => {
        const floorRooms = shown.filter((r) => r.floor === floor);
        if (floorRooms.length === 0) return null;
        return (
          <Panel key={floor} title={`Floor ${floor}`}>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
              {floorRooms.map((room) => (
                <div
                  key={room.number}
                  className={`rounded-lg px-2.5 py-2 ${statusClasses[room.status]}`}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-sm font-medium text-ink">{room.number}</span>
                    <span className="text-[9px] uppercase tracking-[0.12em]">
                      {statusLabel[room.status]}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-ink">{room.type}</div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] text-muted-foreground">
                      {room.guest ?? "Vacant"}
                    </span>
                    <span className="font-mono text-[10px] tnum text-muted-foreground">
                      {rand(room.rate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        );
      })}
    </AppShell>
  );
}
