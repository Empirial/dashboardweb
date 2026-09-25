import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, Panel, Stat } from "@/components/AppShell";
import { BookRoomDialog } from "@/components/BookRoomDialog";
import {
  rand,
  rooms as allRooms,
  statusClasses,
  statusDot,
  statusLabel,
  type RoomStatus,
} from "@/lib/hotel-data";
import {
  TODAY,
  addReservation,
  bookedNights,
  calendarDays,
  isWeekend,
  shortDay,
  useReservations,
  weekdayLetter,
} from "@/lib/reservations";

export const Route = createFileRoute("/rooms")({
  head: () => ({
    meta: [
      { title: "Room Board · Empirial Hotel Ops" },
      {
        name: "description",
        content: "Housekeeping, availability calendar and room booking for every Empirial Hotel room.",
      },
      { property: "og:title", content: "Room Board · Empirial Hotel Ops" },
      {
        property: "og:description",
        content: "Live housekeeping status, a 14-night availability calendar and instant room booking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
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
  const [dialog, setDialog] = useState<{ room?: string; start?: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const reservations = useReservations();

  const counts = useMemo(() => {
    return allRooms.reduce<Record<string, number>>((acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1;
      return acc;
    }, {});
  }, []);

  const days = useMemo(() => calendarDays(TODAY, 14), []);
  const shown = filter === "all" ? allRooms : allRooms.filter((r) => r.status === filter);
  const floors = [1, 2, 3];

  const soldTonight = allRooms.filter((r) => bookedNights(reservations, r.number).has(TODAY)).length;

  return (
    <AppShell>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <Stat label="Clean" value={counts["clean"] ?? 0} sub="ready to sell" />
        <Stat label="Dirty" value={counts["dirty"] ?? 0} sub="housekeeping queue" />
        <Stat label="Sold tonight" value={soldTonight} sub="rooms on the calendar" />
        <Stat label="Out of order" value={counts["ooo"] ?? 0} sub="maintenance" />
      </div>

      <Panel
        title="Availability calendar"
        action={
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <i className="inline-block size-2.5 rounded-sm bg-ink" /> Booked
            </span>
            <span className="flex items-center gap-1.5">
              <i className="inline-block size-2.5 rounded-sm border border-border bg-secondary" /> Free
            </span>
            <button
              onClick={() => setDialog({})}
              className="rounded-md bg-primary px-2.5 py-1.5 text-[11px] font-semibold text-primary-foreground"
            >
              New booking
            </button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-paper pb-2 pr-3 text-left text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Room
                </th>
                {days.map((d) => (
                  <th key={d} className="pb-2 text-center">
                    <div className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                      {weekdayLetter(d)}
                    </div>
                    <div
                      className={`font-mono text-[10px] tnum ${isWeekend(d) ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {shortDay(d).split(" ")[0]}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allRooms.map((room) => {
                const taken = bookedNights(reservations, room.number);
                return (
                  <tr key={room.number}>
                    <td className="sticky left-0 z-10 bg-paper py-0.5 pr-3">
                      <div className="flex items-center gap-1.5">
                        <i className={`inline-block size-1.5 rounded-full ${statusDot[room.status]}`} />
                        <span className="font-mono text-[11px] tnum">{room.number}</span>
                        <span className="text-[10px] text-muted-foreground">{room.type}</span>
                      </div>
                    </td>
                    {days.map((d) => {
                      const res = taken.get(d);
                      const blocked = room.status === "ooo";
                      return (
                        <td key={d} className="p-0.5">
                          <button
                            disabled={!!res || blocked}
                            onClick={() => setDialog({ room: room.number, start: d })}
                            title={
                              blocked
                                ? `Rm ${room.number} out of order`
                                : res
                                  ? `${res.guest} · ${res.id}`
                                  : `Book Rm ${room.number} from ${shortDay(d)}`
                            }
                            className={`h-6 w-full rounded-sm text-[9px] transition-colors ${
                              blocked
                                ? "bg-secondary/60 text-muted-foreground line-through"
                                : res
                                  ? "bg-ink text-paper"
                                  : "border border-border bg-secondary hover:border-primary hover:bg-primary/10"
                            }`}
                          >
                            {res ? res.guest.split(" ").at(-1)?.slice(0, 3) : blocked ? "—" : ""}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Tap any free night to book that room from that date. Dark blocks are existing stays.
        </p>
      </Panel>

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
                  ? "bg-primary text-primary-foreground"
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
              {floorRooms.map((room) => {
                const taken = bookedNights(reservations, room.number);
                const next = [...taken.keys()].sort().find((d) => d >= TODAY);
                return (
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
                        {next ? `Next ${shortDay(next)}` : "Open"}
                      </span>
                      <span className="font-mono text-[10px] tnum text-muted-foreground">
                        {rand(room.rate)}
                      </span>
                    </div>
                    <button
                      disabled={room.status === "ooo"}
                      onClick={() => setDialog({ room: room.number })}
                      className="mt-2 w-full rounded-md border border-border bg-paper py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
                    >
                      Book
                    </button>
                  </div>
                );
              })}
            </div>
          </Panel>
        );
      })}

      {toast && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-ink px-4 py-2.5 text-[12px] text-paper">
          {toast}
        </div>
      )}

      <BookRoomDialog
        key={`${dialog?.room ?? "any"}-${dialog?.start ?? "today"}`}
        open={!!dialog}
        onClose={() => setDialog(null)}
        presetRoom={dialog?.room}
        presetStart={dialog?.start}
        onConfirm={(draft) => {
          const created = addReservation({ ...draft, source: "Front desk", payment: "Unpaid" });
          setDialog(null);
          setToast(`${created.id} · Rm ${created.room} held for ${created.guest}`);
          window.setTimeout(() => setToast(null), 3500);
        }}
      />
    </AppShell>
  );
}
